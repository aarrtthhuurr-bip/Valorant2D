(function registerAdminTerminal(global) {
  'use strict';

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  class AdminTerminal {
    constructor({ registry, bridge }) {
      this.registry = registry;
      this.bridge = bridge;
      this.visible = false;
      this.suggestionIndex = 0;
      this.history = [];
      this.historyIndex = 0;
      this.activeSuggestions = [];
      this.render();
      this.registerEvents();
    }

    render() {
      this.root = document.createElement('section');
      this.root.id = 'adminTerminal';
      this.root.className = 'admin-terminal hidden';
      this.root.setAttribute('aria-hidden', 'true');
      this.root.innerHTML = `
        <header><strong>V2D ADMIN TERMINAL</strong><div><span>F8 / Shift+T</span><button type="button" class="admin-terminal-compact" aria-label="Recolher terminal" title="Recolher terminal">⌃</button><button type="button" class="admin-terminal-close" aria-label="Fechar terminal" title="Fechar terminal">×</button></div></header>
        <div class="admin-terminal-log" role="log" aria-live="polite"></div>
        <div class="admin-terminal-suggestions hidden" role="listbox"></div>
        <div class="admin-terminal-prompt"><span>admin@server:~$</span><input type="text" autocomplete="off" spellcheck="false" aria-label="Comando administrativo"><button type="button" class="admin-terminal-submit" aria-label="Enviar comando">ENVIAR</button></div>`;
      document.body.appendChild(this.root);
      this.log = this.root.querySelector('.admin-terminal-log');
      this.input = this.root.querySelector('input');
      this.suggestionsBox = this.root.querySelector('.admin-terminal-suggestions');
      this.submitButton = this.root.querySelector('.admin-terminal-submit');
      this.compactButton = this.root.querySelector('.admin-terminal-compact');
      this.closeButton = this.root.querySelector('.admin-terminal-close');
    }

    registerEvents() {
      document.addEventListener('keydown', (event) => {
        const targetIsInput = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target?.isContentEditable;
        const shiftT = event.shiftKey && event.key.toLowerCase() === 't' && !targetIsInput;
        if ((event.key === 'F8' || shiftT) && !event.ctrlKey && !event.metaKey) {
          if (!this.bridge.isAdmin()) return;
          event.preventDefault();
          event.stopPropagation();
          this.toggle();
        }
      }, true);
      this.input.addEventListener('input', () => this.updateSuggestions());
      this.input.addEventListener('keydown', (event) => this.handleInputKey(event));
      this.submitButton.addEventListener('click', () => void this.submit());
      this.compactButton.addEventListener('click', () => this.toggleCompact());
      this.closeButton.addEventListener('click', () => this.toggle(false));
      this.root.addEventListener('pointerdown', (event) => {
        // Sugestões e controles interativos nunca devem acionar o recolhimento.
        // O fundo, o cabeçalho textual e o log funcionam como uma área rápida
        // para minimizar o terminal sem fechá-lo por completo.
        if (event.target.closest('.admin-terminal-suggestions, .admin-terminal-prompt, button')) return;
        this.toggleCompact(true);
      });
      document.addEventListener('pointerdown', (event) => {
        if (this.visible && !event.composedPath().includes(this.root)) this.toggle(false);
      });
      this.suggestionsBox.addEventListener('pointerdown', (event) => {
        const option = event.target.closest('[data-suggestion-index]');
        if (!option) return;
        event.preventDefault();
        event.stopPropagation();
        this.applySuggestion(Number(option.dataset.suggestionIndex));
      });
      this.suggestionsBox.addEventListener('click', (event) => {
        // O botão é substituído quando a sugestão é aplicada; impedir o
        // clique residual evita que ele alcance qualquer handler global do jogo.
        event.preventDefault();
        event.stopPropagation();
      });
    }

    toggleCompact(force) {
      const compact = typeof force === 'boolean' ? force : !this.root.classList.contains('is-compact');
      this.root.classList.toggle('is-compact', compact);
      this.compactButton.textContent = compact ? '⌄' : '⌃';
      this.compactButton.title = compact ? 'Expandir terminal' : 'Recolher terminal';
      this.compactButton.setAttribute('aria-label', this.compactButton.title);
      if (!compact) requestAnimationFrame(() => this.input.focus());
    }

    toggle(force) {
      const next = typeof force === 'boolean' ? force : !this.visible;
      if (next && !this.bridge.isAdmin()) return;
      this.visible = next;
      this.root.classList.toggle('hidden', !next);
      this.root.setAttribute('aria-hidden', String(!next));
      if (next) {
        if (!this.log.children.length) this.print('Terminal administrativo inicializado. Digite help para ver os comandos.', 'system');
        void this.bridge.prepareInventoryItems?.().then(() => this.updateSuggestions()).catch(() => {});
        requestAnimationFrame(() => this.input.focus());
      } else {
        this.input.blur();
        this.hideSuggestions();
      }
    }

    handleInputKey(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        void this.submit();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        if (this.activeSuggestions.length) this.applySuggestion(this.suggestionIndex);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        // As setas ficam reservadas ao histórico quando não há sugestões.
        // A lista de autocomplete é operada somente por Tab ou clique/toque.
        if (!this.suggestionsBox.classList.contains('hidden')) event.stopPropagation();
        else this.navigateHistory(event.key === 'ArrowUp' ? -1 : 1);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        this.toggle(false);
      }
      event.stopPropagation();
    }

    navigateHistory(direction) {
      if (!this.history.length) return;
      this.historyIndex = Math.max(0, Math.min(this.history.length, this.historyIndex + direction));
      this.input.value = this.history[this.historyIndex] || '';
    }

    updateSuggestions(reset = true) {
      const value = this.input.value;
      const matches = this.registry.suggestions(value, { bridge: this.bridge }).slice(0, 8);
      this.activeSuggestions = matches;
      if (reset) this.suggestionIndex = 0;
      if (!matches.length) {
        this.hideSuggestions();
        return;
      }
      this.suggestionIndex = Math.min(this.suggestionIndex, matches.length - 1);
      this.suggestionsBox.innerHTML = matches.map((suggestion, index) => `
        <button type="button" data-suggestion-index="${index}" class="${index === this.suggestionIndex ? 'is-active' : ''}">
          <strong>${escapeHtml(suggestion.label)} <i>${escapeHtml(suggestion.usage || '')}</i></strong>
          <span>${escapeHtml(suggestion.description)}</span>
        </button>`).join('');
      this.suggestionsBox.classList.remove('hidden');
    }

    applySuggestion(index = 0) {
      const suggestion = this.activeSuggestions[index] || this.activeSuggestions[0];
      if (!suggestion) return;
      this.input.value = suggestion.value;
      this.input.focus();
      this.updateSuggestions();
    }

    hideSuggestions() {
      this.suggestionsBox.classList.add('hidden');
      this.suggestionsBox.replaceChildren();
      this.activeSuggestions = [];
    }

    async submit() {
      const source = this.input.value.trim();
      if (!source) return;
      const resolved = this.registry.resolve(source);
      const sensitive = new Set(['account create', 'account set_password', 'account set_answer']);
      const printableSource = sensitive.has(resolved?.command?.name)
        ? `${resolved.command.name} ${resolved.args[0] || ''} ********`
        : source;
      if (!sensitive.has(resolved?.command?.name)) this.history.push(source);
      this.historyIndex = this.history.length;
      this.print(`admin@server:~$ ${printableSource}`, 'command');
      this.input.value = '';
      this.hideSuggestions();
      this.input.disabled = true;
      this.submitButton.disabled = true;
      this.root.classList.add('is-busy');
      try {
        const output = await this.registry.execute(source, { terminal: this, bridge: this.bridge });
        if (output !== undefined && output !== null && output !== '') this.print(output, 'output', { html: typeof output === 'object' && output.html });
      } catch (error) {
        this.print(error?.message || 'Falha desconhecida.', 'error');
      } finally {
        this.input.disabled = false;
        this.submitButton.disabled = false;
        this.root.classList.remove('is-busy');
        this.input.focus();
      }
    }

    print(content, tone = 'output', { html = false } = {}) {
      const line = document.createElement('div');
      line.className = `admin-terminal-line is-${tone}`;
      if (html) line.innerHTML = content.html;
      else line.textContent = String(content);
      this.log.appendChild(line);
      this.log.scrollTop = this.log.scrollHeight;
    }

    clear() { this.log.replaceChildren(); }
  }

  global.AdminTerminal = AdminTerminal;

  function formatAccount(account) {
    return [
      `UUID: ${account.uuid}`,
      `Usuário: ${account.username}`,
      `E-mail: ${account.email || '-'}`,
      `Status: ${account.is_banned ? 'BANIDO' : 'ATIVO'}`,
      `Função: ${account.is_admin ? 'ADMIN' : 'PLAYER'}`,
      `Core: ${Number(account.core_balance || 0).toLocaleString('pt-BR')}`,
    ].join('\n');
  }

  function splitStack(value) {
    return String(value || '').split(/\s*\/\s*/).map((entry) => entry.trim()).filter(Boolean);
  }

  function parseTargetStack(args) {
    const targets = splitStack(args.join(' '));
    if (!targets.length) throw new Error('Informe ao menos um alvo. Separe vários alvos com /.');
    return [...new Set(targets)];
  }

  function parseEconomyBatch(args) {
    const source = args.join(' ').trim();
    const match = source.match(/^(.*?)\s+(-?\d+)$/);
    if (!match) throw new Error('Uso: <target> [/ <target>...] <amount>');
    return { targets: parseTargetStack([match[1]]), amount: Number(match[2]) };
  }

  function parseInventoryBatch(args, bridge) {
    const knownItems = new Set([...bridge.inventoryItems(), '-all'].map((item) => item.toLowerCase()));
    const tokens = args.join(' ').trim().split(/\s+/);
    const itemStart = tokens.findIndex((token) => splitStack(token)
      .some((part) => knownItems.has(part.toLowerCase())));
    if (itemStart < 1) throw new Error('Informe alvo(s) e item(ns) válidos do catálogo. Separe lotes com /.');
    const targets = splitStack(tokens.slice(0, itemStart).join(' '));
    const items = splitStack(tokens.slice(itemStart).join(' '));
    if (!targets.length || !items.length) throw new Error('Informe ao menos um alvo e um item.');
    return { targets: [...new Set(targets)], items: [...new Set(items)] };
  }

  function parseAgentBatch(args, bridge) {
    const knownAgents = new Set([...bridge.agentItems(), '-all'].map((agent) => agent.toLowerCase()));
    const tokens = args.join(' ').trim().split(/\s+/);
    const agentStart = tokens.findIndex((token) => splitStack(token)
      .some((part) => knownAgents.has(part.toLowerCase())));
    if (agentStart < 1) throw new Error('Informe alvo(s) e agente(s) válidos. Use -all para todos.');
    const targets = splitStack(tokens.slice(0, agentStart).join(' '));
    const agents = splitStack(tokens.slice(agentStart).join(' '));
    if (!targets.length || !agents.length) throw new Error('Informe ao menos um alvo e um agente.');
    return { targets: [...new Set(targets)], agents: [...new Set(agents)] };
  }

  async function executeBatch(entries, operation) {
    const lines = [];
    for (const entry of entries) {
      try {
        lines.push(`<span class="terminal-success">${escapeHtml(await operation(entry))}</span>`);
      } catch (error) {
        lines.push(`<span class="terminal-batch-error">[ERROR] ${escapeHtml(entry.label || entry.target || entry)}: ${escapeHtml(error?.message || 'Falha desconhecida.')}</span>`);
      }
    }
    return { html: lines.join('<br>') };
  }

  function registerCommands(registry, bridge) {
    const register = (definition) => registry.register(definition);
    register({
      name: 'help', description: 'Lista todos os comandos disponíveis.', usage: '',
      execute: () => ({ html: registry.list().map((command) => `<div class="terminal-help-row"><b>${escapeHtml(command.name)}</b> <i>${escapeHtml(command.usage || '')}</i><span>${escapeHtml(command.description)}</span></div>`).join('') }),
    });
    register({ name: 'clear', description: 'Limpa o log do terminal.', usage: '', execute: (_args, { terminal }) => terminal.clear() });
    register({ name: 'terminal compact', description: 'Alterna o terminal entre os modos completo e compacto.', usage: '', execute: (_args, { terminal }) => { terminal.toggleCompact(); return 'Modo do terminal alterado.'; } });
    register({
      name: 'account list', description: 'Lista as 15 contas mais recentes.', usage: '',
      execute: async () => {
        const payload = await bridge.api('/api/admin-terminal/accounts');
        return payload.accounts.length ? payload.accounts.map(formatAccount).join('\n\n') : 'Nenhuma conta encontrada.';
      },
    });
    register({
      name: 'account view', description: 'Exibe perfil, estatísticas e inventário.', usage: '<target>', minimumArguments: 1,
      execute: async ([target]) => {
        const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(target)}`);
        return `${formatAccount(payload.account)}\nPartidas: ${payload.account.total_matches} | Kills: ${payload.account.total_kills} | Mortes: ${payload.account.total_deaths}\nAgentes: ${(payload.inventory.agents || []).join(', ') || '-'}\nSkins: ${payload.inventory.skins.map((item) => item.skin_id).join(', ') || '-'}\nUtilitários: ${payload.inventory.gadgets.map((item) => item.gadget_id).join(', ') || '-'}`;
      },
    });
    register({
      name: 'account create', description: 'Cria uma conta local administrativamente.', usage: '<email> <password> [player|admin]', minimumArguments: 2,
      execute: async ([email, password, role = 'player']) => {
        const payload = await bridge.api('/api/admin-terminal/accounts', { method: 'POST', body: { email, password, role } });
        return `Conta criada.\n${formatAccount(payload.account)}`;
      },
    });
    register({
      name: 'account login_as', description: 'Entra em uma conta sem solicitar a senha.', usage: '<target>', minimumArguments: 1,
      execute: async ([target]) => bridge.loginAs(target),
    });
    for (const field of ['password', 'question', 'answer']) register({
      name: `account set_${field}`,
      description: `Altera ${field === 'password' ? 'a senha' : field === 'question' ? 'a pergunta de segurança' : 'a resposta de segurança'} da conta.`,
      usage: `<target> <${field === 'password' ? 'nova_senha' : 'texto'}>`, minimumArguments: 2,
      execute: async ([target, ...value]) => {
        const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(target)}/credential`, {
          method: 'POST', body: { field, value: value.join(' ') },
        });
        return `[SUCCESS] ${field} atualizado para ${payload.account.username}.`;
      },
    });
    register({
      name: 'account ban', description: 'Suspende uma ou mais contas e revoga suas sessões.', usage: '<target> [/ <target>...]', minimumArguments: 1,
      execute: async (args) => executeBatch(parseTargetStack(args), async (target) => {
        const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(target)}/ban`, { method: 'POST', body: {} });
        return `[SUCCESS] Conta ${payload.account.username} suspensa.`;
      }),
    });
    for (const action of ['make_admin', 'revoke_admin']) register({
      name: `account ${action}`,
      description: action === 'make_admin' ? 'Promove uma conta para Admin.' : 'Revoga privilégios administrativos.',
      usage: '<target> [/ <target>...]', minimumArguments: 1,
      execute: async (args) => executeBatch(parseTargetStack(args), async (target) => {
        const promote = action === 'make_admin';
        const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(target)}/role`, {
          method: 'POST', body: { role: promote ? 'admin' : 'player' },
        });
        const identity = payload.account.email || payload.account.username;
        return `[SUCCESS] User ${identity} has been ${promote ? 'promoted to Admin' : 'demoted to Player'}.`;
      }),
    });
    register({
      name: 'eco give', description: 'Adiciona Core ao saldo de uma ou mais contas.', usage: '<target> [/ <target>...] <amount>', minimumArguments: 2,
      execute: async (args) => {
        const { targets, amount } = parseEconomyBatch(args);
        if (!Number.isInteger(amount) || amount < 1) throw new Error('A quantidade deve ser um inteiro positivo.');
        return executeBatch(targets, async (target) => {
          const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(target)}/core`, { method: 'POST', body: { amount } });
          return `[SUCCESS] ${amount.toLocaleString('pt-BR')} C concedidos a ${payload.account.username}. Saldo: ${Number(payload.account.core_balance).toLocaleString('pt-BR')} C.`;
        });
      },
    });
    register({
      name: 'eco set', description: 'Define o saldo Core exato de uma ou mais contas.', usage: '<target> [/ <target>...] <amount>', minimumArguments: 2,
      execute: async (args) => {
        const { targets, amount } = parseEconomyBatch(args);
        if (!Number.isInteger(amount) || amount < 0 || amount > 1000000) {
          throw new Error('O saldo deve ser um inteiro entre 0 e 1000000.');
        }
        return executeBatch(targets, async (target) => {
          const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(target)}/core`, {
            method: 'POST', body: { amount, set: true },
          });
          return `[SUCCESS] Saldo de ${payload.account.username} definido como ${Number(payload.account.core_balance).toLocaleString('pt-BR')} C.`;
        });
      },
    });
    register({
      name: 'eco reset', description: 'Define o saldo Core da conta como zero.', usage: '<target>', minimumArguments: 1,
      execute: async ([target]) => {
        const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(target)}/core`, { method: 'POST', body: { reset: true } });
        return `Saldo de ${payload.account.username} redefinido para 0 C.`;
      },
    });
    register({
      name: 'vfx play', description: 'Executa um efeito visual isolado.', usage: '<effect_name>', minimumArguments: 1,
      staticParams: [['color_gain', 'hit_spark', 'explosion', 'level_up']],
      execute: async ([effect]) => bridge.playVfx(effect),
    });
    register({
      name: 'ui toggle', description: 'Alterna uma camada da interface.', usage: '<component>', minimumArguments: 1,
      staticParams: [['inventory', 'hud', 'scoreboard', 'settings']],
      execute: async ([component]) => bridge.toggleUi(component),
    });
    register({ name: 'debug hitboxes', description: 'Alterna os contornos de colisão.', usage: '', execute: () => bridge.toggleDebug('hitboxes') });
    register({ name: 'debug stats', description: 'Alterna FPS, memória e latência do banco.', usage: '', execute: () => bridge.toggleDebug('stats') });
    register({ name: 'match pause', description: 'Pausa ou retoma física e timers.', usage: '', execute: () => bridge.pauseMatch() });
    register({
      name: 'match force_end', description: 'Força o encerramento do round.', usage: '<winner_team>', minimumArguments: 1,
      staticParams: [['attackers', 'defenders', 'draw']], execute: ([winner]) => bridge.forceEnd(winner),
    });
    register({
      name: 'server broadcast', description: 'Exibe uma mensagem global aos jogadores conectados.', usage: '<message>', minimumArguments: 1,
      execute: async (parts) => {
        const payload = await bridge.api('/api/admin-terminal/broadcast', { method: 'POST', body: { message: parts.join(' ') } });
        return `Broadcast #${payload.event.id} publicado.`;
      },
    });
    register({
      name: 'code list', description: 'Lista todos os códigos promocionais.', usage: '',
      execute: async () => {
        const payload = await bridge.api('/api/admin-terminal/codes');
        return payload.codes.length ? payload.codes.map((code) => `#${code.id} ${code.code_display} | ${code.core_amount} C | ${code.active ? 'ATIVO' : 'INATIVO'}`).join('\n') : 'Nenhum código cadastrado.';
      },
    });
    register({
      name: 'code create', description: 'Cria um código promocional de Core.', usage: '<codigo> <amount>', minimumArguments: 2,
      execute: async ([code, amount]) => {
        const payload = await bridge.api('/api/admin-terminal/codes', { method: 'POST', body: { code, amount: Number(amount) } });
        return `[SUCCESS] Código ${payload.code.code_display} criado com ${payload.code.core_amount} C.`;
      },
    });
    register({
      name: 'code delete', description: 'Exclui um código pelo texto ou ID.', usage: '<codigo|id>', minimumArguments: 1,
      execute: async ([code]) => {
        const payload = await bridge.api(`/api/admin-terminal/codes/${encodeURIComponent(code)}`, { method: 'DELETE' });
        return `[SUCCESS] Código ${payload.code.code_display} excluído.`;
      },
    });
    register({
      name: 'wave set', description: 'Limpa as ameaças e inicia a wave indicada.', usage: '<numero>', minimumArguments: 1,
      execute: ([wave]) => bridge.setWave(Number(wave)),
    });
    register({
      name: 'shop open', description: 'Abre a loja de um modo para testes.', usage: '<default|blackout|outbreak>', minimumArguments: 1,
      staticParams: [['default', 'blackout', 'outbreak']], execute: ([mode]) => bridge.openShop(mode),
    });
    register({ name: 'roulette test', description: 'Abre a versão administrativa da roleta de skins.', usage: '', execute: () => bridge.openRoulette() });
    register({
      name: 'give', description: 'Entrega créditos, arma ou item ao jogador durante a partida.', usage: '<credits|weapon|item> <valor>', minimumArguments: 2,
      staticParams: (index, args, context) => index === 0 ? ['credits', 'weapon', 'item'] : args[0] === 'weapon' ? context.bridge.matchWeapons() : args[0] === 'item' ? ['armor', 'ammo', 'health', 'ultimate', 'spike'] : [],
      execute: ([kind, ...value]) => bridge.give(kind, value.join(' ')),
    });
    register({ name: 'swapteam', description: 'Troca o jogador de equipe durante a partida.', usage: '', execute: () => bridge.swapTeam() });
    register({ name: 'cheats', description: 'Abre o painel de cheats durante a partida.', usage: '', execute: () => bridge.openCheats() });
    register({
      name: 'timescale', description: 'Altera a velocidade da simulação.', usage: '<escala>', minimumArguments: 1,
      staticParams: [['0.25', '0.5', '1', '1.5', '2']], execute: ([scale]) => bridge.setTimeScale(Number(scale)),
    });
    register({
      name: 'player kick', description: 'Encerra as sessões do jogador e o remove do jogo.', usage: '<target> <reason>', minimumArguments: 2,
      execute: async ([target, ...reason]) => {
        const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(target)}/kick`, { method: 'POST', body: { reason: reason.join(' ') } });
        return `${payload.account.username} removido: ${payload.reason}`;
      },
    });
    for (const action of ['grant', 'revoke']) register({
      name: `inv ${action}`,
      description: action === 'grant' ? 'Libera um item no inventário.' : 'Remove um item do inventário.',
      usage: '<target> [/ <target>...] <skin|item|-all> [/ <item>...]', minimumArguments: 2,
      stackedParams: true,
      staticParams: (index, args, context) => index >= 1 ? ['-all', ...context.bridge.inventoryItems()] : [],
      execute: async (args) => {
        await bridge.prepareInventoryItems?.();
        const { targets, items } = parseInventoryBatch(args, bridge);
        const operations = targets.flatMap((target) => items.map((item) => ({ target, item, label: `${target} / ${item}` })));
        return executeBatch(operations, async ({ target, item }) => {
          const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(target)}/inventory/${encodeURIComponent(item)}`, {
            method: action === 'grant' ? 'POST' : 'DELETE', body: {},
          });
          return `[SUCCESS] ${payload.item.name} ${action === 'grant' ? 'liberado para' : 'removido de'} ${payload.account.username}.`;
        });
      },
    });
    for (const action of ['grant', 'revoke']) register({
      name: `agent ${action}`,
      description: action === 'grant' ? 'Desbloqueia agentes para uma conta.' : 'Remove agentes desbloqueáveis de uma conta.',
      usage: '<target> [/ <target>...] <agent|-all> [/ <agent>...]', minimumArguments: 2,
      stackedParams: true,
      staticParams: (index, args, context) => index >= 1 ? ['-all', ...context.bridge.agentItems()] : [],
      execute: async (args) => {
        const { targets, agents } = parseAgentBatch(args, bridge);
        const operations = targets.flatMap((target) => agents.map((agent) => ({ target, agent, label: `${target} / ${agent}` })));
        return executeBatch(operations, async ({ target, agent }) => {
          const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(target)}/agents/${encodeURIComponent(agent)}`, {
            method: action === 'grant' ? 'POST' : 'DELETE', body: {},
          });
          return `[SUCCESS] ${payload.agent.name} ${action === 'grant' ? 'desbloqueado para' : 'removido de'} ${payload.account.username}.`;
        });
      },
    });
  }

  function boot() {
    const bridge = global.Valorant2DAdminBridge;
    if (!bridge || !global.CommandRegistry) return;
    const registry = new global.CommandRegistry();
    registerCommands(registry, bridge);
    global.valorant2DAdminTerminal = new AdminTerminal({ registry, bridge });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})(window);
