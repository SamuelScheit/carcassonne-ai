from carcassonne.objects.game_phase import GamePhase


class Action:
    @staticmethod
    def game_phase(action: int):
        if action < 225: return GamePhase.TILES
        if action < 245: return GamePhase.TYPE
        if action < 249: return GamePhase.ROTATION
        return GamePhase.MEEPLES


# position:
# 0   - 225
# 225 - 245
# 245 - 249
# 249 - 255
