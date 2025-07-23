@@ .. @@
   // Actualizar configuraciones de usuario
   async updateUserSettings(userId: string, settings: any) {
     const { data, error } = await supabase
       .from("user_settings")
       .upsert({
         user_id: userId,
         ...settings,
         updated_at: new Date().toISOString(),
       })
       .select()
       .single()
 
     return { data, error }
   },
 
+  // Obtener configuraciones de usuario
+  async getUserSettings(userId: string) {
+    const { data, error } = await supabase
+      .from("user_settings")
+      .select("*")
+      .eq("user_id", userId)
+      .single()
+
+    return { data, error }
+  },
+
   // Obtener notificaciones del usuario
   async getUserNotifications(userId: string) {
     const { data, error } = await supabase
       .from("notifications")
       .select("*")
       .eq("user_id", userId)
       .order("created_at", { ascending: false })
       .limit(10)
 
     return { data, error }
   },