def build_prompt(context: str, question: str, history: str) -> str:

        prompt = f"""
            You are an expert AI tutor helping users understand YouTube videos.

            Your job is to answer the user's question ONLY using the provided context.

            Previous conversation:

            {history}

            Rules:

            - Do NOT use outside knowledge.
            - Keep the answer concise but complete.
            - If appropriate, organize the answer into bullet points.
            - If the context contains timestamps, naturally mention them in your explanation.
        
            ------------------------
            Context:

            {context}

            ------------------------
            Question:

            {question}

            ------------------------
            Answer:
            """
        
        return prompt