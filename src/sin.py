import torch
from torch.autograd import Variable
import numpy as np
import pylab as pl
import torch.nn.init as init

dtype = torch.FloatTensor
input_size, hidden_size, output_size = 20, 19, 1
epochs = 300
seq_length = 50
lr = 0.1
data_time_steps = np.linspace(2, 20, seq_length + 1)
data = np.sin(data_time_steps)
data.resize((seq_length + 1, 1))

x = Variable(torch.Tensor(data[:-1]).type(dtype), requires_grad=False)
y = Variable(torch.Tensor(data[1:]).type(dtype), requires_grad=False)


w1 = torch.FloatTensor(input_size,
                       hidden_size).type(dtype)
init.normal(w1, 0.0, 0.4)
w1 = Variable(w1, requires_grad=True)
w2 = torch.FloatTensor(hidden_size, output_size).type(dtype)
init.normal(w2, 0.0, 0.3)
w2 = Variable(w2, requires_grad=True)


def forward(input, context_state, w1, w2):
    xh = torch.cat((input, context_state), 1)
    context_state = torch.tanh(xh.mm(w1))
    out = context_state.mm(w2)
    return (out, context_state)


pl.ion()
pl.show()

i = 0
# for i in range(epochs):
while True:
    i = i + 1
    predictions = []
    total_loss = 0
    context_state = Variable(torch.zeros(
        (1, hidden_size)).type(dtype), requires_grad=True)

    for j in range(x.size(0)):
        input = x[j:(j+1)]
        target = y[j:(j+1)]
        (pred, context_state) = forward(input, context_state, w1, w2)
        loss = (pred - target).pow(2).sum()/2
        total_loss += loss
        loss.backward()
        w1.data -= lr * w1.grad.data
        w2.data -= lr * w2.grad.data
        w1.grad.data.zero_()
        w2.grad.data.zero_()
        context_state = Variable(context_state.data)
        predictions.append(pred.data.numpy().ravel()[0])

    if i % 20 == 0:
        pl.clf()
        pl.plot(data_time_steps[:-1], x.data.numpy(), label="Actual")
        pl.plot(data_time_steps[1:], predictions, label="Predicted")
        pl.legend()
        pl.draw()
        pl.pause(0.00001)
        print("Epoch: {} loss {:0f}%".format(i, (total_loss * 100)))

pl.ioff()
pl.show()
# pl.pause(20)

print("finished")
