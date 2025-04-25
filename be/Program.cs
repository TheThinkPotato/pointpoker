// using FastEndpoints;

var bld = WebApplication.CreateBuilder();
// bld.Services.AddFastEndpoints();
bld.Services.AddSignalR();

const string UI_URL = "http://localhost:5173";

bld.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithOrigins(UI_URL);
    });
});

var app = bld.Build();

app.UseCors("AllowReactApp");

app.MapGet("/", () => "API UP!");
// SignalR
app.MapHub<PointingHub>("/PacketHub");

// app.UseFastEndpoints();
app.Run();


