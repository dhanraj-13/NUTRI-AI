# user_memory module

class UserMemory:
    def __init__(self):
        self._preferences: dict[str, dict] = {}

    def set_preferences(self, user_id: str, preferences: dict) -> None:
        self._preferences[user_id] = preferences

    def get_preferences(self, user_id: str) -> dict:
        return self._preferences.get(user_id, {})


user_memory = UserMemory()
