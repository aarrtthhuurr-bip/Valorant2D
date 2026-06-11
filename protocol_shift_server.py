from __future__ import annotations

import argparse
import functools
import http.server
import socket
import socketserver
import sys
import threading
import webbrowser
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DEFAULT_PORTS = (8088, 8124)


class ProtocolShiftHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
    }

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, format: str, *args: object) -> None:
        return


class ReusableThreadingServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def port_is_free(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.3)
        return sock.connect_ex(("127.0.0.1", port)) != 0


def find_port(preferred_ports: list[int]) -> int:
    for port in preferred_ports:
        if port_is_free(port):
            return port
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def parse_ports(value: str | None) -> list[int]:
    if not value:
        return list(DEFAULT_PORTS)
    ports: list[int] = []
    for chunk in value.replace(";", ",").split(","):
        chunk = chunk.strip()
        if not chunk:
            continue
        try:
            port = int(chunk)
        except ValueError:
            continue
        if 1 <= port <= 65535:
            ports.append(port)
    return ports or list(DEFAULT_PORTS)


def main() -> int:
    parser = argparse.ArgumentParser(description="Servidor local do Valorant2D.")
    parser.add_argument("--ports", default=None, help="Lista de portas preferidas. Ex: 8088,8124")
    parser.add_argument("--open", action="store_true", help="Abrir o jogo no navegador.")
    args = parser.parse_args()

    port = find_port(parse_ports(args.ports))
    handler = functools.partial(ProtocolShiftHandler, directory=str(ROOT))
    url = f"http://127.0.0.1:{port}/"

    try:
        with ReusableThreadingServer(("127.0.0.1", port), handler) as server:
            print(f"Protocol Shift rodando em {url}", flush=True)
            print("Feche esta janela para parar o servidor.", flush=True)
            if args.open:
                threading.Timer(0.4, webbrowser.open, args=(url,)).start()
            server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.", flush=True)
        return 0
    except OSError as exc:
        print(f"Erro fatal ao iniciar servidor: {exc}", file=sys.stderr, flush=True)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
