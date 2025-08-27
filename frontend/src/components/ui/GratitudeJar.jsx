"use client"

import { Heart } from "lucide-react"

export default function GratitudeJar({ entries, onJarClick }) {
  // Generate random positions and rotations for notes
  const generateNoteStyle = (index) => {
    const colors = ["#FFB6C1", "#DDA0DD", "#98FB98", "#F0E68C", "#87CEEB", "#DEB887", "#F8BBD9", "#E6E6FA"]
    const rotations = [-25, -18, -12, -6, 0, 6, 12, 18, 25]

    return {
      backgroundColor: colors[index % colors.length],
      left: `${10 + (index % 6) * 12}%`,
      top: `${20 + Math.floor(index / 6) * 15}%`,
      transform: `rotate(${rotations[index % rotations.length]}deg)`,
    }
  }

  return (
    <div className="flex justify-center mb-12">
      <div
        className="relative cursor-pointer transform hover:scale-105 transition-transform duration-300"
        onClick={onJarClick}
      >
        {/* Mason Jar Container */}
        <div className="w-80 h-96 relative">
          {/* Jar Body - Mason jar shape with straight sides and rounded bottom */}
          <div
            className="absolute bottom-0 w-full h-80 bg-gradient-to-b from-white/10 via-white/20 to-white/30 border-4 border-[#9370DB]/30 backdrop-blur-sm overflow-hidden shadow-xl"
            style={{ borderRadius: "0 0 40px 40px" }}
          >
            {/* Mason jar threading lines */}
            <div className="absolute top-0 left-0 right-0 h-8 border-b-2 border-[#9370DB]/20"></div>
            <div className="absolute top-2 left-0 right-0 h-1 border-b border-[#9370DB]/15"></div>
            <div className="absolute top-4 left-0 right-0 h-1 border-b border-[#9370DB]/15"></div>

            {/* Gratitude Notes Inside Jar */}
            <div className="absolute inset-4 top-12">
              {entries.slice(0, 20).map((entry, index) => (
                <div
                  key={entry.id || index}
                  className="absolute w-8 h-12 rounded-sm shadow-sm transition-all duration-300 hover:scale-110 border border-white/20"
                  style={generateNoteStyle(index)}
                >
                  {/* Rolled paper effect */}
                  <div className="w-full h-full flex items-center justify-center relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-sm"></div>
                    <Heart className="w-2 h-2 text-[#4B0082]" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-sm"></div>
                  </div>
                </div>
              ))}

              {/* Empty jar message */}
              {entries.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="w-8 h-8 text-[#9370DB]/40 mx-auto mb-2" />
                    <p className="text-[#6A5ACD]/60 text-sm">Your jar is waiting for grateful moments</p>
                  </div>
                </div>
              )}
            </div>

            {/* Click to view text */}
            {entries.length > 0 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-[#4B0082] text-sm font-medium">Click to view notes</p>
                <div className="flex justify-center mt-1">
                  <div className="w-2 h-2 bg-[#9370DB] rounded-full animate-pulse"></div>
                </div>
              </div>
            )}

            {/* Jar shine effect */}
            <div className="absolute top-12 left-8 w-12 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-sm"></div>
          </div>

          {/* Mason Jar Lid */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-72 h-12 bg-gradient-to-b from-[#C0C0C0] to-[#A0A0A0] rounded-t-lg shadow-lg border-2 border-[#808080]">
            {/* Lid ridges */}
            <div className="absolute inset-x-2 top-1 bottom-1 bg-gradient-to-b from-[#D0D0D0] to-[#B0B0B0] rounded-t-md">
              <div className="h-full flex items-center justify-center space-x-1">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-0.5 h-6 bg-[#909090] rounded-full"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Lid knob */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-[#D0D0D0] to-[#A0A0A0] rounded-full shadow-lg border border-[#808080]"></div>
        </div>

        {/* Jar Label */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#DDA0DD] to-[#E6E6FA] text-[#4B0082] px-8 py-3 rounded-full text-sm font-medium shadow-lg border-2 border-[#9370DB]/30">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Gratitude Collection</span>
            <Heart className="w-4 h-4" />
          </div>
        </div>

        {/* Floating hearts animation */}
        {entries.length > 0 && (
          <>
            <div
              className="absolute -top-8 -left-4 w-3 h-3 text-[#DDA0DD] animate-bounce"
              style={{ animationDelay: "0s" }}
            >
              <Heart className="w-full h-full" />
            </div>
            <div
              className="absolute -top-6 -right-2 w-2 h-2 text-[#9370DB] animate-bounce"
              style={{ animationDelay: "1s" }}
            >
              <Heart className="w-full h-full" />
            </div>
            <div
              className="absolute -top-10 left-1/2 w-2.5 h-2.5 text-[#E6E6FA] animate-bounce"
              style={{ animationDelay: "2s" }}
            >
              <Heart className="w-full h-full" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
