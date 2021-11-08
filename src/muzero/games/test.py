import gym
import gym_minigrid

env = gym.make("MiniGrid-Empty-Random-6x6-v0")
env.reset()
print(env.step(0))