
import torch
import torch.nn as nn
import torch.nn.functional as F  # Import F for ReLU
from torch_geometric.nn import GCNConv

class GNNModel(torch.nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.conv1 = GCNConv(input_dim, hidden_dim)
        # self.conv2 = GCNConv(hidden_dim, hidden_dim)  # Removed conv2
        self.lin2 = nn.Linear(hidden_dim, output_dim)  # Linear layer

    def forward(self, data):
        x, edge_index = data.x, data.edge_index
        x = self.conv1(x, edge_index)  # Pass through GCNConv
        x = F.relu(x)  # Apply ReLU
        x = self.lin2(x) # Pass through linear layer
        x = F.relu(x)  # Apply ReLU again
        return x
