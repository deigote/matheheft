#!/usr/bin/env python3
"""Serve only the static workbook, optionally to other devices on the LAN."""
import argparse
import functools
import http.server
import pathlib
import socket
import subprocess
import sys
import threading
import webbrowser

parser = argparse.ArgumentParser(description='Mein Matheheft lokal starten')
parser.add_argument('--port', type=int, default=8765)
parser.add_argument('--local-only', action='store_true')
parser.add_argument('--no-browser', action='store_true')
args = parser.parse_args()
directory = pathlib.Path(__file__).resolve().parent / 'dist'
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(directory))
host = '127.0.0.1' if args.local_only else '0.0.0.0'
try:
    server = http.server.ThreadingHTTPServer((host, args.port), handler)
except OSError as error:
    print(f'Der Server konnte nicht starten: {error}', file=sys.stderr)
    print('Versuche einen anderen Port: python3 serve.py --port 8766', file=sys.stderr)
    sys.exit(1)

url = f'http://localhost:{args.port}/'
print(f'\nMein Matheheft\nAuf diesem Computer: {url}', flush=True)
if not args.local_only:
    addresses = set()
    try:
        addresses.add(socket.gethostbyname(socket.gethostname()))
    except OSError:
        pass
    if sys.platform == 'darwin':
        for interface in ('en0', 'en1', 'en2'):
            result = subprocess.run(['/usr/sbin/ipconfig', 'getifaddr', interface], capture_output=True, text=True)
            if result.returncode == 0:
                addresses.add(result.stdout.strip())
    for address in sorted(addresses):
        if address and not address.startswith('127.'):
            print(f'Im selben WLAN: http://{address}:{args.port}/', flush=True)
print('Dieses Fenster geöffnet lassen. Beenden mit Ctrl+C.\n', flush=True)
if not args.no_browser:
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()
try:
    server.serve_forever()
except KeyboardInterrupt:
    print('\nServer beendet.')
finally:
    server.server_close()
