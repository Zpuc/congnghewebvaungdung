using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.Threading.Tasks;
using Microsoft.OpenApi.Models;
using MyWebAPI.BLL;
using MyWebAPI.BLL.Services;
using MyWebAPI.DAL;
using MyWebAPI.DAL.Repositories;
using System.Text;
using static MyWebAPI.BLL.Services.PhatBLL;
using static MyWebAPI.DAL.Repositories.PhatDAL;
using static MyWebAPI.DAL.Repositories.PhieuMuonDAL;

var builder = WebApplication.CreateBuilder(args);

// ==================== CONNECTION STRING ====================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

// ==================== CORS ====================
const string CorsPolicy = "DevCors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy.WithOrigins(
                "http://127.0.0.1:5500",
                "http://localhost:5500",
                "https://localhost:7053",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ==================== DI REPOSITORIES & SERVICES ====================
builder.Services.AddScoped<ISachRepository>(_ => new SachRepository(connectionString));
builder.Services.AddScoped<IBanSaoRepository>(_ => new BanSaoRepository(connectionString));
builder.Services.AddScoped<ITaiKhoanRepository>(_ => new TaiKhoanRepository(connectionString));
builder.Services.AddScoped<ITheLoaiRepository>(_ => new TheLoaiRepository(connectionString));
builder.Services.AddScoped<IKeSachRepository>(_ => new KeSachRepository(connectionString));
builder.Services.AddScoped<IPhieuMuonRepository>(_ => new PhieuMuonRepository(connectionString));
builder.Services.AddScoped<IBanDocRepository>(_ => new BanDocRepository(connectionString));
builder.Services.AddScoped<IDatChoStorage>(_ => new SqlDatChoStorage(connectionString));
builder.Services.AddScoped<IPhatRepository>(_ => new PhatRepository(connectionString));
builder.Services.AddScoped<IThanhToanRepository>(_ => new ThanhToanRepository(connectionString));
builder.Services.AddScoped<IYeuCauThanhToanPhatRepository>(_ => new YeuCauThanhToanPhatRepository(connectionString));
builder.Services.AddScoped<ITonKhoRepository>(_ => new TonKhoRepository(connectionString));


builder.Services.AddScoped<ITonKhoService, TonKhoService>();
builder.Services.AddScoped<ISachService, SachService>();
builder.Services.AddScoped<IBanSaoService, BanSaoService>();
builder.Services.AddScoped<ITaiKhoanService, TaiKhoanService>();
builder.Services.AddScoped<ITheLoaiService, TheLoaiService>();
builder.Services.AddScoped<IKeSachService, KeSachService>();
builder.Services.AddScoped<IPhieuMuonService, PhieuMuonService>();
builder.Services.AddScoped<IBanDocService, BanDocService>();
builder.Services.AddScoped<IDatChoService, DatChoService>();
builder.Services.AddScoped<IPhatService, PhatService>();
builder.Services.AddScoped<IThanhToanService, ThanhToanService>();
builder.Services.AddScoped<IYeuCauThanhToanPhatService, YeuCauThanhToanPhatService>();

// ==================== JWT AUTHENTICATION ====================
// BẮT BUỘC phải có section Jwt trong appsettings.json:
// "Jwt": {
//   "Issuer":  "MyWebAPI",
//   "Audience":"MyWebAPIClient",
//   "Key":     "một-chuỗi-bí-mật-ít-nhất-16-ký-tự"
// }

var jwtSection = builder.Configuration.GetSection("Jwt");
var key = jwtSection["Key"];

if (string.IsNullOrWhiteSpace(key) || key.Length < 16)
{
    throw new InvalidOperationException("Jwt:Key chưa cấu hình hoặc quá ngắn (>=16 ký tự).");
}

var keyBytes = Encoding.UTF8.GetBytes(key);

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        // Map claim "role" trong JWT → ClaimTypes.Role để [Authorize(Roles = "...")] khớp ổn định.
        options.MapInboundClaims = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
            ClockSkew = TimeSpan.Zero,
            RoleClaimType = System.Security.Claims.ClaimTypes.Role,
        };

        // GET kệ công khai: không đọc/validate Bearer — tránh 401 + WWW-Authenticate khi browser vẫn gửi token hết hạn.
        // POST/PUT/DELETE /api/KeSach vẫn đọc JWT bình thường (có [Authorize]).
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var path = context.Request.Path.Value ?? string.Empty;
                if (HttpMethods.IsGet(context.Request.Method) &&
                    (string.Equals(path, "/api/KeSach", StringComparison.OrdinalIgnoreCase) ||
                     path.StartsWith("/api/KeSach/", StringComparison.OrdinalIgnoreCase)))
                {
                    context.NoResult();
                }
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                context.NoResult();
                return Task.CompletedTask;
            },
        };
    });

builder.Services.AddAuthorization();

// ==================== SWAGGER ====================
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Thư Viện API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Nhập token JWT: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ==================== CONTROLLERS ====================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ==================== BUILD APP ====================
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Thư Viện API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseStaticFiles();

// KHÔNG dùng UseHttpsRedirection: khi SPA gọi http://localhost:5057, middleware này trả 307→HTTPS
// và trình duyệt từ chối CORS trên request OPTIONS ("Redirect is not allowed for a preflight request").
// Triển khai thật: bật HTTPS ở reverse proxy / IIS trước API.

app.UseCors(CorsPolicy);

// 🔥 LUÔN bật auth, vì phía trên đã đảm bảo Jwt:Key hợp lệ
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
