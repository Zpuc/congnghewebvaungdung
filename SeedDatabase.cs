using System;
using System.Data.SqlClient;

class Program
{
    static void Main()
    {
        var connectionString = @"Data Source=DESKTOP-NTJKGTE\SQLEXPRESS;Initial Catalog=QuanLyThuVien;Integrated Security=True;TrustServerCertificate=True;Encrypt=False;";

        try
        {
            using var con = new SqlConnection(connectionString);
            con.Open();
            Console.WriteLine("✅ Connected to database successfully!");

            // Read and execute the seed_data.sql file
            var sql = System.IO.File.ReadAllText(@"c:\hdv\ptpmhuongdichvu\seed_data.sql");

            // Split by GO statements
            var commands = sql.Split(new[] { "GO" }, StringSplitOptions.RemoveEmptyEntries);

            foreach (var cmd in commands)
            {
                if (cmd.Trim().StartsWith("--") || string.IsNullOrWhiteSpace(cmd.Trim()))
                    continue;

                using var command = new SqlCommand(cmd, con);
                command.ExecuteNonQuery();
                Console.WriteLine("Executed: " + cmd.Substring(0, Math.Min(50, cmd.Trim().Length)) + "...");
            }

            Console.WriteLine("✅ Seed data inserted successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine("❌ Error: " + ex.Message);
            Console.WriteLine(ex.StackTrace);
        }
    }
}
