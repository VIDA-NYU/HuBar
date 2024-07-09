import http.server
import socketserver
import ssl

# Configuration
PORT = 8000
CERT_FILE = 'certs/cert.pem'
KEY_FILE = 'certs/key.pem'

Handler = http.server.SimpleHTTPRequestHandler

# Create an SSL context
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile=CERT_FILE, keyfile=KEY_FILE)

# Create an HTTP server
httpd = socketserver.TCPServer(('localhost', PORT), Handler)

# Wrap the socket with the SSL context
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print(f'Starting HTTPS server on https://localhost:{PORT}/ (Ctrl+C to stop)...')

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass

httpd.server_close()
