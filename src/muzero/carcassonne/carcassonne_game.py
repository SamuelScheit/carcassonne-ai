from carcassonne.carcassonne_game_state import CarcassonneGameState
from carcassonne.carcassonne_visualiser import CarcassonneVisualiser
from carcassonne.objects.actions.action import Action
from carcassonne.tile_sets.supplementary_rules import SupplementaryRule
from carcassonne.tile_sets.tile_sets import TileSet
from carcassonne.utils.action_util import ActionUtil
from carcassonne.utils.state_updater import StateUpdater
from carcassonne.objects.side import Side
import numpy as np
import traceback

empty_tile = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
              ] + [0, 0, 0, 0] + [0, 0, 0, 0, 0, 0]
board_size = 15


class CarcassonneGame:
    def __init__(self,
                 players: int = 2,
                 tile_sets: [TileSet] = (TileSet.BASE, TileSet.THE_RIVER,
                                         TileSet.INNS_AND_CATHEDRALS),
                 supplementary_rules: [SupplementaryRule
                                       ] = (SupplementaryRule.FARMERS,
                                            SupplementaryRule.ABBOTS),
                 visualiser: CarcassonneVisualiser = CarcassonneVisualiser()):
        self.players = players
        self.tile_sets = tile_sets
        self.supplementary_rules = supplementary_rules
        self.state: CarcassonneGameState = CarcassonneGameState(
            tile_sets=tile_sets,
            players=players,
            supplementary_rules=supplementary_rules)
        self.visualiser = visualiser

    def reset(self):
        self.state = CarcassonneGameState(
            tile_sets=self.tile_sets,
            supplementary_rules=self.supplementary_rules)
        return self.get_observation()

    def step(self, player: int, action: Action):
        self.state = StateUpdater.apply_action(game_state=self.state,
                                               action=action)

    def step2(self, a: int):
        try:
            player = self.get_current_player()
            pre_score = self.state.scores[player]
            self.state = StateUpdater.apply_action2(self.state, a)
            # + 10 for a valid action
            return (self.get_observation(),
                    (pre_score - self.state.scores[player]) * 200 + 10,
                    self.is_finished())
        except Exception as e:
            print(e)
            print(traceback.format_exc())
            return (self.get_observation(), -50, True)

    def render(self):
        self.visualiser.draw_game_state(self.state)

    def is_finished(self) -> bool:
        return self.state.is_terminated()

    def get_current_player(self) -> int:
        return self.state.current_player

    def get_possible_actions(self) -> [Action]:
        return ActionUtil.get_possible_actions(self.state)

    def get_possible_actions2(self) -> [Action]:
        return ActionUtil.get_possible_actions(self.state)

    def get_observation(self):
        out = []

        for row_index, row in enumerate(self.state.board):
            o = []
            for column_index, tile in enumerate(row):
                a = empty_tile
                if tile is not None:
                    a = tile.observation(self.state, row_index, column_index)

                o.append(a)
            out.append(o)

        next_tile = empty_tile
        if self.state.next_tile is not None:
            next_tile = self.state.next_tile.observation(self.state)

        out.append([
            [self.state.phase.value] + self.state.scores +
            ([0] * (len(empty_tile) - 3)),
            next_tile,
        ] + ([empty_tile] * (board_size - 2)))

        return np.array(out, dtype="int32")
