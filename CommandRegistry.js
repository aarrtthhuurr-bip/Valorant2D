(function registerCommandRegistry(global) {
  'use strict';

  class CommandRegistry {
    constructor() {
      this.commands = new Map();
    }

    register(command) {
      const name = String(command?.name || '').trim().toLowerCase();
      if (!name || typeof command.execute !== 'function') throw new TypeError('Comando inválido.');
      this.commands.set(name, { ...command, name });
      return this;
    }

    list() {
      return [...this.commands.values()].sort((a, b) => a.name.localeCompare(b.name));
    }

    suggestions(input, context = {}) {
      const source = String(input || '').trimStart();
      const query = source.toLowerCase();
      const trailingSpace = /\s$/.test(source);
      const resolved = this.resolve(source);

      // Enquanto o nome ainda está incompleto, sugere comandos completos.
      if (!resolved || (!trailingSpace && resolved.args.length === 0 && query !== resolved.command.name)) {
        return this.list()
          .filter((command) => !query || command.name.startsWith(query) || command.name.includes(query))
          .map((command) => ({
            type: 'command', value: `${command.name} `, label: command.name,
            usage: command.usage || '', description: command.description || '',
          }));
      }

      const provider = resolved.command.staticParams;
      if (!provider || (!trailingSpace && resolved.args.length === 0)) return [];
      const argumentIndex = trailingSpace ? resolved.args.length : Math.max(0, resolved.args.length - 1);
      const currentValue = trailingSpace ? '' : String(resolved.args[argumentIndex] || '');
      const values = typeof provider === 'function'
        ? provider(argumentIndex, resolved.args, context)
        : Array.isArray(provider?.[argumentIndex]) ? provider[argumentIndex] : provider;
      if (!Array.isArray(values)) return [];
      const prefixArgs = resolved.args.slice(0, argumentIndex);
      return values
        .map((entry) => typeof entry === 'string' ? { value: entry, description: '' } : entry)
        .filter((entry) => String(entry.value).toLowerCase().startsWith(currentValue.toLowerCase()))
        .map((entry) => ({
          type: 'parameter',
          value: `${resolved.command.name} ${[...prefixArgs, entry.value].join(' ')} `,
          label: entry.label || entry.value,
          usage: `parâmetro ${argumentIndex + 1}`,
          description: entry.description || resolved.command.description || '',
        }));
    }

    tokenize(input) {
      const tokens = [];
      const pattern = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|(\S+)/g;
      let match;
      while ((match = pattern.exec(String(input || '')))) {
        tokens.push((match[1] ?? match[2] ?? match[3]).replace(/\\([\\"'])/g, '$1'));
      }
      return tokens;
    }

    resolve(input) {
      const tokens = this.tokenize(input);
      for (let length = tokens.length; length > 0; length -= 1) {
        const name = tokens.slice(0, length).join(' ').toLowerCase();
        if (this.commands.has(name)) return { command: this.commands.get(name), args: tokens.slice(length) };
      }
      return null;
    }

    async execute(input, context = {}) {
      const resolved = this.resolve(input);
      if (!resolved) throw new Error(`Comando desconhecido: ${String(input || '').trim() || '(vazio)'}`);
      const required = Number(resolved.command.minimumArguments) || 0;
      if (resolved.args.length < required) throw new Error(`Uso: ${resolved.command.name} ${resolved.command.usage || ''}`.trim());
      return resolved.command.execute(resolved.args, context);
    }
  }

  global.CommandRegistry = CommandRegistry;
})(window);
