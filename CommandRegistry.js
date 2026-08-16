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

    suggestions(input) {
      const query = String(input || '').trimStart().toLowerCase();
      if (!query) return this.list();
      return this.list().filter((command) => command.name.startsWith(query) || command.name.includes(query));
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
