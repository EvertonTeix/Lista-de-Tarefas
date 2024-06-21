using ListaTarefasAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ListaTarefasAPI.Context
{
    //faz a ponte entre a entidade e o banco de dados
    public class TarefaDbContext : DbContext
    {
        public TarefaDbContext(DbContextOptions<TarefaDbContext> options) : base(options)
        {
            
        }

        public DbSet<Tarefa> Tarefas { get; set; }
    }
}
