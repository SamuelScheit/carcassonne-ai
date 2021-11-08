import random
from typing import Optional
from carcassonne.carcassonne_game import CarcassonneGame
from carcassonne.carcassonne_game_state import CarcassonneGameState
from carcassonne.objects.actions.action import Action
from carcassonne.objects.meeple_type import MeepleType
from carcassonne.tile_sets.supplementary_rules import SupplementaryRule
from carcassonne.tile_sets.tile_sets import TileSet
from abstract_game import AbstractGame

game = CarcassonneGame(players=2,
                       tile_sets=[TileSet.BASE],
                       supplementary_rules=[])

while not game.is_finished():
    player: int = game.get_current_player()
    valid_actions: [Action] = game.get_possible_actions()
    action: Optional[Action] = random.choice(valid_actions)
    if action is not None:
        game.step(player, action)
    game.render()

input("Press enter to exit")
