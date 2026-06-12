# conversation_memory module

class ConversationMemory:
    def __init__(self):
        self._messages: dict[str, list[str]] = {}

    def add(self, user_id: str, role: str, message: str) -> None:
        self._messages.setdefault(user_id, []).append(f"{role}: {message}")
        self._messages[user_id] = self._messages[user_id][-20:]

    def get(self, user_id: str) -> list[str]:
        return self._messages.get(user_id, [])

    def clear(self, user_id: str) -> None:
        self._messages.pop(user_id, None)


conversation_memory = ConversationMemory()
