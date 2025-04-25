using Microsoft.AspNetCore.SignalR;

public class PointingHub : Hub
{
    private static Dictionary<string, Dictionary<string, string>> roomVotes = new();

    public async Task JoinRoom(string roomId, string userName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        await Clients.Group(roomId).SendAsync("UserJoined", userName);
    }

    public async Task SubmitVote(string roomId, string userName, string vote)
    {
        if (!roomVotes.ContainsKey(roomId))
            roomVotes[roomId] = new Dictionary<string, string>();

        roomVotes[roomId][userName] = vote;

        await Clients.Group(roomId).SendAsync("VoteSubmitted", userName, vote);
    }

    public async Task RevealVotes(string roomId)
    {
        if (roomVotes.TryGetValue(roomId, out var votes))
        {
            await Clients.Group(roomId).SendAsync("VotesRevealed", votes);
        }
    }

    public async Task ClearVotes(string roomId)
    {
        if (roomVotes.ContainsKey(roomId))
        {
            roomVotes[roomId].Clear();
            await Clients.Group(roomId).SendAsync("VotesCleared");
        }
    }
}
