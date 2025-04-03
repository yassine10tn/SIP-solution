var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JSON Serializer
builder.Services.AddControllersWithViews().AddNewtonsoftJson();

// CORS - Read allowed origins from appsettings.json
var allowedOrigins = builder.Configuration.GetSection("allowedOrigins").Get<string[]>() ?? new string[] { };

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:4200")  // Allow frontend requests
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS with the specified policy
app.UseCors("AllowSpecificOrigins");  // ✅ Ensure CORS is applied before other middleware

app.UseAuthorization();
app.MapControllers();
app.Run();