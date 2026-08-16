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
      this.render();
      this.registerEvents();
    }

    render() {
      this.root = document.createElement('section');
      this.root.id = 'adminTerminal';
      this.root.className = 'admin-terminal hidden';
      this.root.setAttribute('aria-hidden', 'true');
      this.root.innerHTML = `
        <header><strong>V2D ADMIN TERMINAL</strong><span>F8 / ~ para fechar</span></header>
        <div class="admin-terminal-log" role="log" aria-live="polite"></div>
        <div class="admin-terminal-suggestions hidden" role="listbox"></div>
        <label class="admin-terminal-prompt"><span>admin@server:~$</span><input type="text" autocomplete="off" spellcheck="false" aria-label="Comando administrativo"></label>`;
      document.body.appendChild(this.root);
      this.log = this.root.querySelector('.admin-terminal-log');
      this.input = this.root.querySelector('input');
      this.suggestionsBox = this.root.querySelector('.admin-terminal-suggestions');
    }

    registerEvents() {
      document.addEventListener('keydown', (event) => {
        if ((event.key === 'F8' || event.key === '~' || event.code === 'Backquote') && !event.ctrlKey && !event.metaKey) {
          if (!this.bridge.isAdmin()) return;
          event.preventDefault();
          event.stopPropagation();
          this.toggle();
        }
      }, true);
      this.input.addEventListener('input', () => this.updateSuggestions());
      this.input.addEventListener('keydown', (event) => this.handleInputKey(event));
      this.suggestionsBox.addEventListener('pointerdown', (event) => {
        const option = event.target.closest('[data-command]');
        if (!option) return;
        event.preventDefault();
        this.input.value = `${option.dataset.command} `;
        this.input.focus();
        this.updateSuggestions();
      });
    }

    toggle(force) {
      const next = typeof force === 'boolean' ? force : !this.visible;
      if (next && !this.bridge.isAdmin()) return;
      this.visible = next;
      this.root.classList.toggle('hidden', !next);
      this.root.setAttribute('aria-hidden', String(!next));
      if (next) {
        if (!this.log.children.length) this.print('Terminal administrativo inicializado. Digite help para ver os comandos.', 'system');
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
        const suggestions = this.registry.suggestions(this.input.value);
        if (suggestions.length) {
          this.input.value = `${suggestions[this.suggestionIndex]?.name || suggestions[0].name} `;
          this.updateSuggestions();
        }
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (!this.suggestionsBox.classList.contains('hidden')) {
          event.preventDefault();
          const direction = event.key === 'ArrowDown' ? 1 : -1;
          const count = this.registry.suggestions(this.input.value).length;
          this.suggestionIndex = (this.suggestionIndex + direction + count) % Math.max(1, count);
          this.updateSuggestions(false);
        } else this.navigateHistory(event.key === 'ArrowUp' ? -1 : 1);
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
      const matches = this.registry.suggestions(value).slice(0, 7);
      if (reset) this.suggestionIndex = 0;
      if (!value.trim() || !matches.length || this.registry.resolve(value)) {
        this.hideSuggestions();
        return;
      }
      this.suggestionIndex = Math.min(this.suggestionIndex, matches.length - 1);
      this.suggestionsBox.innerHTML = matches.map((command, index) => `
        <button type="button" data-command="${escapeHtml(command.name)}" class="${index === this.suggestionIndex ? 'is-active' : ''}">
          <strong>${escapeHtml(command.name)} <i>${escapeHtml(command.usage || '')}</i></strong>
          <span>${escapeHtml(command.description)}</span>
        </button>`).join('');
      this.suggestionsBox.classList.remove('hidden');
    }

    hideSuggestions() {
      this.suggestionsBox.classList.add('hidden');
      this.suggestionsBox.replaceChildren();
    }

    async submit() {
      const source = this.input.value.trim();
      if (!source) return;
      const resolved = this.registry.resolve(source);
      const printableSource = resolved?.command?.name === 'account create'
        ? `account create ${resolved.args[0] || ''} ******** ${resolved.args[2] || 'player'}`
        : source;
      if (resolved?.command?.name !== 'account create') this.history.push(source);
      this.historyIndex = this.history.length;
      this.print(`admin@server:~$ ${printableSource}`, 'command');
      this.input.value = '';
      this.hideSuggestions();
      this.input.disabled = true;
      this.root.classList.add('is-busy');
      try {
        const output = await this.registry.execute(source, { terminal: this, bridge: this.bridge });
        if (output !== undefined && output !== null && output !== '') this.print(output, 'output', { html: typeof output === 'object' && output.html });
      } catch (error) {
        this.print(error?.message || 'Falha desconhecida.', 'error');
      } finally {
        this.input.disabled = false;
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

  function registerCommands(registry, bridge) {
    const register = (definition) => registry.register(definition);
    register({
      name: 'help', description: 'Lista todos os comandos disponíveis.', usage: '',
      execute: () => ({ html: registry.list().map((command) => `<div class="terminal-help-row"><b>${escapeHtml(command.name)}</b> <i>${escapeHtml(command.usage || '')}</i><span>${escapeHtml(command.description)}</span></div>`).join('') }),
    });
    register({ name: 'clear', description: 'Limpa o log do terminal.', usage: '', execute: (_args, { terminal }) => terminal.clear() });
    register({
      name: 'account list', description: 'Lista as 20 contas mais recentes.', usage: '',
      execute: async () => {
        const payload = await bridge.api('/api/admin-terminal/accounts');
        return payload.accounts.length ? payload.accounts.map(formatAccount).join('\n\n') : 'Nenhuma conta encontrada.';
      },
    });
    register({
      name: 'account view', description: 'Exibe perfil, estatísticas e inventário.', usage: '<uuid>', minimumArguments: 1,
      execute: async ([uuid]) => {
        const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(uuid)}`);
        return `${formatAccount(payload.account)}\nPartidas: ${payload.account.total_matches} | Kills: ${payload.account.total_kills} | Mortes: ${payload.account.total_deaths}\nSkins: ${payload.inventory.skins.map((item) => item.skin_id).join(', ') || '-'}\nUtilitários: ${payload.inventory.gadgets.map((item) => item.gadget_id).join(', ') || '-'}`;
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
      name: 'account ban', description: 'Suspende a conta e revoga suas sessões.', usage: '<uuid>', minimumArguments: 1,
      execute: async ([uuid]) => {
        const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(uuid)}/ban`, { method: 'POST', body: {} });
        return `Conta ${payload.account.username} suspensa.`;
      },
    });
    register({
      name: 'eco give', description: 'Adiciona Core ao saldo de uma conta.', usage: '<uuid> <amount>', minimumArguments: 2,
      execute: async ([uuid, rawAmount]) => {
        const amount = Number(rawAmount);
        if (!Number.isInteger(amount) || amount < 1) throw new Error('A quantidade deve ser um inteiro positivo.');
        const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(uuid)}/core`, { method: 'POST', body: { amount } });
        return `${amount.toLocaleString('pt-BR')} C concedidos a ${payload.account.username}. Saldo: ${Number(payload.account.core_balance).toLocaleString('pt-BR')} C.`;
      },
    });
    register({
      name: 'eco reset', description: 'Define o saldo Core da conta como zero.', usage: '<uuid>', minimumArguments: 1,
      execute: async ([uuid]) => {
        const payload = await bridge.api(`/api/admin-terminal/accounts/${encodeURIComponent(uuid)}/core`, { method: 'POST', body: { reset: true } });
        return `Saldo de ${payload.account.username} redefinido para 0 C.`;
      },
    });
    register({
      name: 'vfx play', description: 'Executa um efeito visual isolado.', usage: '<color_gain|victory_confetti|hit_flash>', minimumArguments: 1,
      execute: async ([effect]) => bridge.playVfx(effect),
    });
    register({
      name: 'ui toggle', description: 'Alterna uma camada da interface.', usage: '<inventory|missions|ranking|options|hud>', minimumArguments: 1,
      execute: async ([component]) => bridge.toggleUi(component),
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
