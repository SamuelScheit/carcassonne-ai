from enum import Enum


class GamePhase(Enum):
    TILES = 0
    TYPE = "type"  # skipped tile type (infered by drawn card)
    ROTATION = 1
    MEEPLES = -1

    def to_json(self):
        return self.value

    def __str__(self):
        if self.value == 0: return "TILES"
        if self.value == 1: return "ROTATION"
        if self.value == -1: return "MEEPLES"

        return self.value
