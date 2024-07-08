# server.py
import http.server
import socketserver
import ssl

# Configuration
PORT = 8000
CERT_FILE = 'certs/cert.pem'
KEY_FILE = 'certs/key.pem'

Handler = http.server.SimpleHTTPRequestHandler

# Create an HTTP server with SSL support
httpd = socketserver.TCPServer(('localhost', PORT), Handler)
httpd.socket = ssl.wrap_socket(httpd.socket, certfile=CERT_FILE, keyfile=KEY_FILE, server_side=True)

print(f'Starting HTTPS server on https://localhost:{PORT}/ (Ctrl+C to stop)...')

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass

httpd.server_close()
