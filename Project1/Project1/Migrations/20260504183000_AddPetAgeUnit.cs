using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project1.Migrations
{
    public partial class AddPetAgeUnit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AgeUnit",
                table: "Pets",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "Years");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AgeUnit",
                table: "Pets");
        }
    }
}
