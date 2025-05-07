var bld = WebApplication.CreateBuilder();
bld.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5051); // Expose on port 5051
});

bld.Services.AddSignalR();

string[] UI_URL = { "http://localhost:5173", "http://10.1.1.80" };

bld.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder
            // .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .AllowAnyHeader()
            .AllowCredentials()
            .WithOrigins(UI_URL);
            // .SetIsOriginAllowedToAllowWildcardSubdomains();
    });
});

var app = bld.Build();

app.UseCors("AllowReactApp");

app.MapGet("/", () => "API UP!");
// SignalR
app.MapHub<PointingHub>("/PacketHub");

// app.UseFastEndpoints();
app.Run();


