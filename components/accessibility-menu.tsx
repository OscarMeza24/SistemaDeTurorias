@@ .. @@
 "use client"
 
-import { Accessibility, Type, Eye, Volume2, MousePointer } from "lucide-react"
+import { Accessibility, Type, Eye, Volume2, MousePointer, Contrast } from "lucide-react"
 import { Button } from "@/components/ui/button"
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   DropdownMenuCheckboxItem,
 } from "@/components/ui/dropdown-menu"
-import { useState } from "react"
+import { useState, useEffect } from "react"
+import { useAuth } from "@/hooks/useAuth"
+import { databaseService } from "@/lib/database"
 
 export function AccessibilityMenu() {
+  const { user } = useAuth()
   const [settings, setSettings] = useState({
     highContrast: false,
     largeText: false,
     screenReader: false,
     reducedMotion: false,
     focusIndicator: true,
   })
 
+  // Cargar configuraciones guardadas
+  useEffect(() => {
+    const loadSettings = async () => {
+      if (user) {
+        try {
+          const { data } = await databaseService.getUserSettings(user.id)
+          if (data?.accessibility_settings) {
+            setSettings(prev => ({
+              ...prev,
+              ...data.accessibility_settings
+            }))
+            applySettings(data.accessibility_settings)
+          }
+        } catch (error) {
+          console.error('Error loading accessibility settings:', error)
+        }
+      } else {
+        // Cargar desde localStorage si no hay usuario
+        const savedSettings = localStorage.getItem('accessibility-settings')
+        if (savedSettings) {
+          const parsed = JSON.parse(savedSettings)
+          setSettings(prev => ({ ...prev, ...parsed }))
+          applySettings(parsed)
+        }
+      }
+    }
+
+    loadSettings()
+  }, [user])
+
+  const applySettings = (newSettings: any) => {
+    const root = document.documentElement
+    const body = document.body
+
+    // Alto contraste
+    if (newSettings.highContrast) {
+      root.classList.add("high-contrast")
+    } else {
+      root.classList.remove("high-contrast")
+    }
+
+    // Texto grande
+    if (newSettings.largeText) {
+      root.classList.add("large-text")
+    } else {
+      root.classList.remove("large-text")
+    }
+
+    // Reducir animaciones
+    if (newSettings.reducedMotion) {
+      root.classList.add("reduced-motion")
+    } else {
+      root.classList.remove("reduced-motion")
+    }
+
+    // Indicadores de foco mejorados
+    if (newSettings.focusIndicator) {
+      root.classList.add("enhanced-focus")
+    } else {
+      root.classList.remove("enhanced-focus")
+    }
+
+    // Lector de pantalla (agregar atributos ARIA)
+    if (newSettings.screenReader) {
+      body.setAttribute('aria-live', 'polite')
+      body.setAttribute('aria-atomic', 'true')
+    } else {
+      body.removeAttribute('aria-live')
+      body.removeAttribute('aria-atomic')
+    }
+  }
+
+  const saveSettings = async (newSettings: any) => {
+    if (user) {
+      try {
+        await databaseService.updateUserSettings(user.id, {
+          accessibility_settings: newSettings
+        })
+      } catch (error) {
+        console.error('Error saving accessibility settings:', error)
+      }
+    } else {
+      // Guardar en localStorage si no hay usuario
+      localStorage.setItem('accessibility-settings', JSON.stringify(newSettings))
+    }
+  }
+
   const toggleSetting = (key: keyof typeof settings) => {
-    setSettings((prev) => ({
+    const newSettings = {
       ...prev,
       [key]: !prev[key],
-    }))
+    }
 
-    // Apply accessibility settings to document
-    const root = document.documentElement
+    setSettings(newSettings)
+    applySettings(newSettings)
+    saveSettings(newSettings)
+  }
 
-    if (key === "highContrast") {
-      root.classList.toggle("high-contrast", !settings.highContrast)
-    }
-    if (key === "largeText") {
-      root.classList.toggle("large-text", !settings.largeText)
-    }
-    if (key === "reducedMotion") {
-      root.classList.toggle("reduced-motion", !settings.reducedMotion)
+  // Función para anunciar cambios al lector de pantalla
+  const announceChange = (setting: string, enabled: boolean) => {
+    if (settings.screenReader) {
+      const message = `${setting} ${enabled ? 'activado' : 'desactivado'}`
+      const announcement = document.createElement('div')
+      announcement.setAttribute('aria-live', 'assertive')
+      announcement.setAttribute('aria-atomic', 'true')
+      announcement.className = 'sr-only'
+      announcement.textContent = message
+      document.body.appendChild(announcement)
+      setTimeout(() => document.body.removeChild(announcement), 1000)
     }
   }
 
   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button variant="ghost" size="icon" aria-label="Opciones de accesibilidad">
           <Accessibility className="h-4 w-4" />
         </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="end" className="w-56">
         <DropdownMenuLabel>Accesibilidad</DropdownMenuLabel>
         <DropdownMenuSeparator />
 
-        <DropdownMenuCheckboxItem checked={settings.highContrast} onCheckedChange={() => toggleSetting("highContrast")}>
-          <Eye className="mr-2 h-4 w-4" />
+        <DropdownMenuCheckboxItem 
+          checked={settings.highContrast} 
+          onCheckedChange={() => {
+            toggleSetting("highContrast")
+            announceChange("Alto contraste", !settings.highContrast)
+          }}
+        >
+          <Contrast className="mr-2 h-4 w-4" />
           Alto Contraste
         </DropdownMenuCheckboxItem>
 
-        <DropdownMenuCheckboxItem checked={settings.largeText} onCheckedChange={() => toggleSetting("largeText")}>
+        <DropdownMenuCheckboxItem 
+          checked={settings.largeText} 
+          onCheckedChange={() => {
+            toggleSetting("largeText")
+            announceChange("Texto grande", !settings.largeText)
+          }}
+        >
           <Type className="mr-2 h-4 w-4" />
           Texto Grande
         </DropdownMenuCheckboxItem>
 
         <DropdownMenuCheckboxItem
           checked={settings.reducedMotion}
-          onCheckedChange={() => toggleSetting("reducedMotion")}
+          onCheckedChange={() => {
+            toggleSetting("reducedMotion")
+            announceChange("Reducir animaciones", !settings.reducedMotion)
+          }}
         >
           <MousePointer className="mr-2 h-4 w-4" />
           Reducir Animaciones
         </DropdownMenuCheckboxItem>
 
-        <DropdownMenuCheckboxItem checked={settings.screenReader} onCheckedChange={() => toggleSetting("screenReader")}>
+        <DropdownMenuCheckboxItem 
+          checked={settings.screenReader} 
+          onCheckedChange={() => {
+            toggleSetting("screenReader")
+            announceChange("Soporte para lector de pantalla", !settings.screenReader)
+          }}
+        >
           <Volume2 className="mr-2 h-4 w-4" />
-          Lector de Pantalla
+          Soporte Lector de Pantalla
+        </DropdownMenuCheckboxItem>
+
+        <DropdownMenuCheckboxItem 
+          checked={settings.focusIndicator} 
+          onCheckedChange={() => {
+            toggleSetting("focusIndicator")
+            announceChange("Indicadores de foco mejorados", !settings.focusIndicator)
+          }}
+        >
+          <Eye className="mr-2 h-4 w-4" />
+          Indicadores de Foco
         </DropdownMenuCheckboxItem>
 
         <DropdownMenuSeparator />
         <DropdownMenuItem>
-          <span className="text-sm text-muted-foreground">Atajos: Alt + A para abrir</span>
+          <span className="text-sm text-muted-foreground">Atajo: Alt + A</span>
         </DropdownMenuItem>
       </DropdownMenuContent>
     </DropdownMenu>
   )
 }