import http.server
import socketserver
import json
import urllib.parse
import os

class MultiplicationHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            html_content = self.get_html_content()
            self.wfile.write(html_content.encode('utf-8'))
        elif self.path == '/calculate':
            self.handle_calculation()
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/calculate':
            self.handle_calculation()

    def handle_calculation(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        try:
            data = json.loads(post_data.decode('utf-8'))
            num1 = float(data.get('num1', 0))
            num2 = float(data.get('num2', 0))

            result = num1 * num2

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()

            response = {
                'result': result,
                'num1': num1,
                'num2': num2
            }

            self.wfile.write(json.dumps(response).encode('utf-8'))

        except Exception as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            error_response = {'error': str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))

    def get_html_content(self):
        return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Python Multiplication Calculator</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Python Multiplication Calculator</h1>
        <p>Enter two numbers to multiply:</p>

        <div class="input-group">
            <div class="input-field">
                <label for="num1">First Number:</label>
                <input type="number" id="num1" placeholder="Enter first number" step="any">
            </div>

            <div class="input-field">
                <label for="num2">Second Number:</label>
                <input type="number" id="num2" placeholder="Enter second number" step="any">
            </div>
        </div>

        <button id="calculateBtn">Calculate Result</button>

        <div id="loading" class="loading">
            <div class="spinner"></div>
            <p>Calculating...</p>
        </div>

        <div id="result" class="result-hidden">
            <h3>Calculation Result:</h3>
            <div class="result-display">
                <span id="num1Value">0</span>
                <span class="times">×</span>
                <span id="num2Value">0</span>
                <span class="equals">=</span>
                <span id="resultValue">0</span>
            </div>
            <button id="newCalculationBtn">New Calculation</button>
        </div>

        <div id="error" class="error-hidden"></div>
    </div>

    <script src="app.js"></script>
</body>
</html>'''

    def log_message(self, format, *args):
        pass

class MultiplicationHTTPServer:
    def __init__(self, host='localhost', port=8080):
        self.host = host
        self.port = port
        self.handler = MultiplicationHandler

    def start(self):
        with socketserver.TCPServer((self.host, self.port), self.handler) as httpd:
            print(f"Multiplication Calculator Server running on http://{self.host}:{self.port}")
            print("Press Ctrl+C to stop the server")
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nServer stopped by user")
                httpd.shutdown()

if __name__ == "__main__":
    print("Starting Python Multiplication Calculator Web Server...")
    server = MultiplicationHTTPServer()
    server.start()