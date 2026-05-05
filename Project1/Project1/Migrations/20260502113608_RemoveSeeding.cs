using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Project1.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSeeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a9c9f4b0-9876-5432-1abc-def987654321");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "d3c9f4b0-1234-5678-9abc-def012345678");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "a9c9f4b0-9876-5432-1abc-def987654321", "dd7faba5-4ef4-4e1e-aaea-eaaedd6652f8", "Admin", "ADMIN" },
                    { "d3c9f4b0-1234-5678-9abc-def012345678", "c5c55364-be55-474c-9422-e55dde963b3e", "User", "USER" }
                });
        }
    }
}
