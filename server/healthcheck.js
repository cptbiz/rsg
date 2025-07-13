(cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF'
diff --git a/server/healthcheck.js b/server/healthcheck.js
--- a/server/healthcheck.js
+++ b/server/healthcheck.js
@@ -0,0 +1,31 @@
+const http = require('http');
+
+const options = {
+    hostname: 'localhost',
+    port: process.env.PORT || 5001,
+    path: '/api/health',
+    method: 'GET',
+    timeout: 5000
+};
+
+const request = http.request(options, (res) => {
+    if (res.statusCode === 200) {
+        process.exit(0);
+    } else {
+        console.error(`Health check failed with status: ${res.statusCode}`);
+        process.exit(1);
+    }
+});
+
+request.on('error', (error) => {
+    console.error(`Health check error: ${error.message}`);
+    process.exit(1);
+});
+
+request.on('timeout', () => {
+    console.error('Health check timeout');
+    request.destroy();
+    process.exit(1);
+});
+
+request.end();
EOF
)
