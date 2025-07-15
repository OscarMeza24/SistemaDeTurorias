"use client"

import { Accessibility, Type, Eye, Volume2, MousePointer } from "lucide-react"
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
import { useState } from "react"

export function AccessibilityMenu() {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    screenReader: false,
    reducedMotion: false,
    focusIndicator: true,
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))

    // Apply accessibility settings to document
    const root = document.documentElement

    if (key === "highContrast") {
      root.classList.toggle("high-contrast", !settings.highContrast)
    }
    if (key === "largeText") {
      root.classList.toggle("large-text", !settings.largeText)
    }
    if (key === "reducedMotion") {
      root.classList.toggle("reduced-motion", !settings.reducedMotion)
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

        <DropdownMenuCheckboxItem checked={settings.highContrast} onCheckedChange={() => toggleSetting("highContrast")}>
          <Eye className="mr-2 h-4 w-4" />
          Alto Contraste
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem checked={settings.largeText} onCheckedChange={() => toggleSetting("largeText")}>
          <Type className="mr-2 h-4 w-4" />
          Texto Grande
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={settings.reducedMotion}
          onCheckedChange={() => toggleSetting("reducedMotion")}
        >
          <MousePointer className="mr-2 h-4 w-4" />
          Reducir Animaciones
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem checked={settings.screenReader} onCheckedChange={() => toggleSetting("screenReader")}>
          <Volume2 className="mr-2 h-4 w-4" />
          Lector de Pantalla
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span className="text-sm text-muted-foreground">Atajos: Alt + A para abrir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
