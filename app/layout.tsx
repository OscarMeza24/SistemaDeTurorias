@@ .. @@
 import "./globals.css";
 import { ThemeProvider } from "@/components/theme-provider";
 import { AuthProvider } from "@/hooks/AuthProvider";
+import { Toaster } from "@/components/ui/toaster";
 
 const inter = Inter({ subsets: ["latin"] });
 
@@ .. @@
       <body className={inter.className}>
         <ThemeProvider
           attribute="class"
           defaultTheme="system"
           enableSystem
           disableTransitionOnChange
         >
-          <AuthProvider>{children}</AuthProvider>
+          <AuthProvider>
+            <a href="#main-content" className="skip-link">
+              Saltar al contenido principal
+            </a>
+            <main id="main-content">
+              {children}
+            </main>
+            <Toaster />
+          </AuthProvider>
         </ThemeProvider>
       </body>
     </html>
   );
 }