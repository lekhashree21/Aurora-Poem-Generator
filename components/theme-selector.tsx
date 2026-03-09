"use client"

interface Theme {
  id: string
  label: string
  emoji: string
}

interface ThemeSelectorProps {
  themes: Theme[]
  selectedTheme: string
  onSelectTheme: (themeId: string) => void
}

export function ThemeSelector({ themes, selectedTheme, onSelectTheme }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onSelectTheme(theme.id)}
          className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
            selectedTheme === theme.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/50 hover:border-accent/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="text-2xl">{theme.emoji}</span>
          <span className="text-sm font-medium">{theme.label}</span>
        </button>
      ))}
    </div>
  )
}
