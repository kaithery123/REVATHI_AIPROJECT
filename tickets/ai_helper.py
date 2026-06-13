import google.generativeai as genai

# Replace with your REAL Gemini API key
#genai.configure(api_key="AQ.Ab8RN6JUDGxnpqIlLT8cdivcagM7T_MT3DpMDasji1oDb3JsRw")
import os
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def get_ai_analysis(description):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")

        prompt = f"""
You are a customer support AI.

Analyze the ticket and respond EXACTLY in this format:

CATEGORY: Authentication/Billing/Technical/Account/Other
SOLUTION: <solution>

Ticket Description:
{description}

Provide a concise solution in 3-5 sentences.
Do not write an email.
Do not include greetings.
Do not include signatures.
Provide only the category and solution.
"""

        result = model.generate_content(prompt)

        text = result.text.strip()

        category = "Other"
        response = text

        try:
            category = text.split("CATEGORY:")[1].split("SOLUTION:")[0].strip()
            response = text.split("SOLUTION:")[1].strip()
        except Exception:
            pass

        return category, response

    except Exception as e:
        print("AI ERROR:", str(e))

        return (
            "Other",
            "Unable to generate AI response. Please check the Gemini API configuration."
        )