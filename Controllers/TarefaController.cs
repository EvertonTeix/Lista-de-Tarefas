using ListaTarefasAPI.Context;
using ListaTarefasAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ListaTarefasAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TarefaController : ControllerBase
    {
        private readonly TarefaDbContext _context;

        public TarefaController(TarefaDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public List<Tarefa> GetListaTarefas()
        {
            return _context.Tarefas.ToList();
        }

        [HttpGet("{id}")]
        public Tarefa GetTarefasById(int id)
        {
            return _context.Tarefas.SingleOrDefault(e => e.Id == id);

        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var em = _context.Tarefas.SingleOrDefault(x => x.Id == id);

            if (em == null)
            {
                return NotFound("Tarefa com o id " + id + " não existe");
            }

            _context.Tarefas.Remove(em);
            _context.SaveChanges();
            return Ok(em);
        }

        [HttpPost]
        public IActionResult AddTarefa(Tarefa tarefa)
        {
            try
            {
                _context.Tarefas.Add(tarefa);
                _context.SaveChanges();

                return CreatedAtAction(nameof(GetTarefasById), new { id = tarefa.Id }, tarefa);
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao adicionar tarefa: {ex.Message}");
            }
        }


        [HttpPut("{id:int}")]
        public IActionResult Update(int id, Tarefa tarefa)
        {
            var em = _context.Tarefas.SingleOrDefault(x => x.Id == id);
            if (em == null)
            {
                return NotFound("Tarefa com o id " + id + " não existe");
            }

            bool updated = false;

            if (tarefa.isTarefa != null && em.isTarefa != tarefa.isTarefa)
            {
                em.isTarefa = tarefa.isTarefa;
                updated = true;
            }

            if (em.IsComplete != tarefa.IsComplete)
            {
                em.IsComplete = tarefa.IsComplete;
                updated = true;
            }

            if (updated)
            {
                _context.Update(em);
                _context.SaveChanges();
            }

            return Ok(em);
        }


    }
}
