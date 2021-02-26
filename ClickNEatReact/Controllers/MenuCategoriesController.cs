using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClickNEatReact.Data;
using ClickNEatReact.Models;
using Microsoft.AspNetCore.Authorization;

namespace ClickNEatReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuCategoriesController : ControllerBase
    {
        private readonly ClickEatContext _context;

        public MenuCategoriesController(ClickEatContext context)
        {
            _context = context;
        }

        // GET: api/MenuCategories
        [Authorize(Roles = UserRole.Admin)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuCategory>>> GetmenuCategories()
        {
            return await _context.menuCategories.Include(c => c.menuItems).ToListAsync();
        }

        // GET: api/MenuCategories/5
        [Authorize(Roles = UserRole.Admin)]
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuCategory>> GetMenuCategory(int id)
        {
            var menuCategory = await _context.menuCategories.Include(c=>c.menuItems).Where(c=>c.CategoryId==id).FirstOrDefaultAsync();

            if (menuCategory == null)
            {
                return NotFound();
            }

            return menuCategory;
        }

        // PUT: api/MenuCategories/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = UserRole.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMenuCategory(int id, MenuCategory menuCategory)
        {
            if (id != menuCategory.CategoryId)
            {
                return BadRequest();
            }

            _context.Entry(menuCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MenuCategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/MenuCategories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = UserRole.Admin)]
        [HttpPost]
        public async Task<ActionResult<MenuCategory>> PostMenuCategory(MenuCategory menuCategory)
        {
            _context.menuCategories.Add(menuCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMenuCategory", new { id = menuCategory.CategoryId }, menuCategory);
        }

        // DELETE: api/MenuCategories/5
        [Authorize(Roles = UserRole.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenuCategory(int id)
        {
            var menuCategory = await _context.menuCategories.FindAsync(id);
            if (menuCategory == null)
            {
                return NotFound();
            }

            _context.menuCategories.Remove(menuCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MenuCategoryExists(int id)
        {
            return _context.menuCategories.Any(e => e.CategoryId == id);
        }
    }
}
