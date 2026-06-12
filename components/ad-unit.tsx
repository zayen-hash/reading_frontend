"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AdUnit({ slot }: { slot: string }) {
  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense may be blocked or not loaded — that's fine
    }
  }, [])

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  // In dev mode without an AdSense client, show a placeholder
  //   if (!clientId) {
  //     return (
  //       <div className="my-4 p-8 rounded-lg border border-dashed border-muted-foreground/30 text-center text-sm text-muted-foreground">
  //         Advertisement placeholder
  //       </div>
  //     );
  //   }

  if (!clientId) {
    return null // Don't render anything if no client ID is provided
  }

  return (
    <div className="my-4">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
