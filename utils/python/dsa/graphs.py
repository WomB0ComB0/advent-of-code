from nodes import AdjNode


class AdjacencyMatrix(object):
    def __init__(self, size):  # Initialize the matrix
        self.adjMatrix = []
        for i in range(size):
            self.adjMatrix.append([0 for i in range(size)])
        self.size = size

    def add_edge(self, v1, v2):  # Add edges
        if v1 == v2:
            print("Same vertex %d and %d" % (v1, v2))
        self.adjMatrix[v1][v2] = 1
        self.adjMatrix[v2][v1] = 1

    def remove_edge(self, v1, v2):  # Remove edges
        if self.adjMatrix[v1][v2] == 0:
            print("No edge between %d and %d" % (v1, v2))
            return
        self.adjMatrix[v1][v2] = 0
        self.adjMatrix[v2][v1] = 0

    def __len__(self):  # Number of vertices
        return self.size

    def print_matrix(self):  # Print the matrix
        if not self.adjMatrix:
            print("Empty")
            return
        for row in self.adjMatrix:
            for val in row:
                print("{:4}".format(val)),
            print()


class AdjacencyList:
    def __init__(self, num):
        self.V = num
        self.graph = [None] * self.V

    def add_edge(self, s, d):  # Add edges
        node = AdjNode(d)
        node.next = self.graph[s]
        self.graph[s] = node
        node = AdjNode(s)
        node.next = self.graph[d]
        self.graph[d] = node

    def print_agraph(self):  # Print the graph
        for i in range(self.V):
            print("Vertex " + str(i) + ":", end="")
            temp = self.graph[i]
            while temp:
                print(" -> {}".format(temp.vertex), end="")
                temp = temp.next
            print(" \n")


class BellmanFord:
    def __init__(self, vertices):
        self.V = vertices
        self.graph = []

    def add_edge(self, s, d, w):  # Add edges
        self.graph.append([s, d, w])

    def printArr(self, dist):  # Print the solution
        print("Vertex Distance from Source")
        for i in range(self.V):
            print("{0}\t\t{1}".format(i, dist[i]))

    def BellmanFord(self, src):  # Bellman Ford algorithm
        dist = [float("Inf")] * self.V
        dist[src] = 0
        for _ in range(self.V - 1):
            for s, d, w in self.graph:
                if dist[s] != float("Inf") and dist[s] + w < dist[d]:
                    dist[d] = dist[s] + w
        for s, d, w in self.graph:
            if dist[s] != float("Inf") and dist[s] + w < dist[d]:
                print("Graph contains negative weight cycle")
                return
        self.printArr(dist)


class Graph:
    def __init__(self, vertices):
        self.V = vertices
        self.graph = []

    def add_edge(self, s, d, w):  # Add edges
        self.graph.append([s, d, w])

    def printArr(self, dist):  # Print the solution
        print("Vertex Distance from Source")
        for i in range(self.V):
            print("{0}\t\t{1}".format(i, dist[i]))

    def min_distance(self, dist, sptSet):  # Find the vertex with minimum distance value
        minimum = float("inf")
        for v in range(self.V):
            if dist[v] < minimum and sptSet[v] == False:
                minimum = dist[v]
                min_index = v
                return min_index

    def dijkstra(self, src):  # Dijkstra algorithm
        dist = [float("inf")] * self.V
        dist[src] = 0
        sptSet = [False] * self.V
        for _ in range(self.V):
            u = self.min_distance(dist, sptSet)
            sptSet[u] = True
            for v in range(self.V):
                if (
                    self.graph[u][v] > 0
                    and sptSet[v] == False
                    and dist[v] > dist[u] + self.graph[u][v]
                ):
                    dist[v] = dist[u] + self.graph[u][v]
        self.printArr(dist)
