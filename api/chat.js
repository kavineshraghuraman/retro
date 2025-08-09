export default async function handler(req, res) {
  console.log("📩 API /api/chat called with message:", req.body.message);

  // Ensure API key is available
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error("❌ DEEPSEEK_API_KEY not set in environment variables.");
    return res.status(500).json({ reply: "⚠️ பிழை: API key இல்லை." });
  }

  try {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `
நீங்கள் ஒரு தமிழ் விவசாய உதவியாளர்.
பதில்களை எப்போதும் **Markdown** வடிவில் எழுதவும்:
- முக்கிய புள்ளிகளை bullet points ஆக எழுதவும்
- முக்கிய வார்த்தைகளை **போல்ட்** ஆக்கவும்
- அட்டவணை தேவைப்பட்டால் Markdown table ஆக எழுதவும்
            `
          },
          { role: "user", content: req.body.message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    console.log("📡 DeepSeek API raw response:", data);

    if (!response.ok) {
      return res.status(response.status).json({ reply: "⚠️ AI சேவையுடன் இணைக்க முடியவில்லை." });
    }

    const reply = data.choices?.[0]?.message?.content || "பதில் வரவில்லை.";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ reply: "⚠️ சர்வர் பிழை." });
  }
}
