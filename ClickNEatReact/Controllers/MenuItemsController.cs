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
using System.IO;

namespace ClickNEatReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemsController : ControllerBase
    {
        private readonly ClickEatContext _context;

        public MenuItemsController(ClickEatContext context)
        {
            _context = context;
        }

        // GET: api/MenuItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuItem>>> GetmenuItems()
        {
            //await PayPalClient.captureOrder();
            return await _context.menuItems.Include(m=>m.MenuCategory).Include(m => m.ItemReviews).ToListAsync();
        }

        // GET: api/MenuItems/5
        
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuItem>> GetMenuItem(int id)
        {
            var menuItem = await _context.menuItems.Include(m => m.MenuCategory).Include(m=>m.ItemReviews).Where(m => m.MenuItemId == id).FirstOrDefaultAsync() ;

            if (menuItem == null)
            {
                return NotFound();
            }

            return menuItem;
        }

        // PUT: api/MenuItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = UserRole.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMenuItem(int id, MenuItem menuItem)
        {
            if (id != menuItem.MenuItemId)
            {
                return BadRequest();
            }

            _context.Entry(menuItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MenuItemExists(id))
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

        // POST: api/MenuItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = UserRole.Admin)]
        [HttpPost]
        public async Task<ActionResult<MenuItem>> PostMenuItem(MenuItem menuItem)
        {
            _context.menuItems.Add(menuItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMenuItem", new { id = menuItem.MenuItemId }, menuItem);
        }

        // DELETE: api/MenuItems/5
        [Authorize(Roles = UserRole.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var menuItem = await _context.menuItems.FindAsync(id);
            if (menuItem == null)
            {
                return NotFound();
            }

            _context.menuItems.Remove(menuItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        [Route("/api/fileupload")]
        public async Task<IActionResult> PostUploadAsync(IFormFile file)
        {
            long size = file.Length;
            var filePath = Path.Combine("wwwroot/img", Guid.NewGuid() + Path.GetExtension(file.FileName));


            if (file.Length > 0)
            {

                Console.WriteLine(filePath);
                using (var stream = System.IO.File.Create(filePath))
                {
                    await file.CopyToAsync(stream);
                }
            }

            return Ok(new { size, url = filePath.Replace("wwwroot", "") });
        }

        private bool MenuItemExists(int id)
        {
            return _context.menuItems.Any(e => e.MenuItemId == id);
        }
    }
}
