using BCrypt.Net;

if (args.Length == 0)
{
    Console.WriteLine("Usage: dotnet run --project Tools/BcryptHasher/BcryptHasher.csproj -- <password> [cost]");
    Console.WriteLine("Example: dotnet run --project Tools/BcryptHasher/BcryptHasher.csproj -- admin 10");
    return;
}

var password = args[0];
var cost = 10;
if (args.Length >= 2 && int.TryParse(args[1], out var parsed))
{
    cost = parsed;
}

var hash = BCrypt.Net.BCrypt.HashPassword(password, cost);
Console.WriteLine(hash);

