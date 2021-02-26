using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClickNEatReact.Data;
using ClickNEatReact.Models;

namespace ClickNEatReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemReviewsController : ControllerBase
    {
        private readonly ClickEatContext _context;

        public ItemReviewsController(ClickEatContext context)
        {
            _context = context;
        }

        // GET: api/ItemReviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemReview>>> GetItemReviews()
        {
            return await _context.ItemReviews.ToListAsync();
        }

        [HttpGet("MenuItem/{menuItemId}")]
        public async Task<ActionResult<IEnumerable<ItemReview>>> GetItemReviewsByMenuItem(int menuItemId)
        {
            return await _context.ItemReviews.Where(m=>m.MenuItemId==menuItemId).OrderByDescending(m=>m.CreatedAt).ToListAsync();
        }

        // GET: api/ItemReviews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemReview>> GetItemReview(int id)
        {
            var itemReview = await _context.ItemReviews.FindAsync(id);

            if (itemReview == null)
            {
                return NotFound();
            }

            return itemReview;
        }


        // PUT: api/ItemReviews/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItemReview(int id, ItemReview itemReview)
        {
            if (id != itemReview.ReviewId)
            {
                return BadRequest();
            }

            _context.Entry(itemReview).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemReviewExists(id))
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

        // POST: api/ItemReviews
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ItemReview>> PostItemReview(ItemReview itemReview)
        {
            
            _context.ItemReviews.Add(itemReview);
            
            MenuItem menuItem = await _context.menuItems.Where(m=>m.MenuItemId==itemReview.MenuItemId).FirstOrDefaultAsync();
            menuItem.ReviewCount += 1;
            menuItem.AvgRate = (menuItem.AvgRate * (double)(menuItem.ReviewCount - 1) + (double)itemReview.Rate) / (double)menuItem.ReviewCount;
            _context.Entry(menuItem).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetItemReview", new { id = itemReview.ReviewId }, itemReview);
        }

        // DELETE: api/ItemReviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItemReview(int id)
        {
            var itemReview = await _context.ItemReviews.FindAsync(id);
            if (itemReview == null)
            {
                return NotFound();
            }

            _context.ItemReviews.Remove(itemReview);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemReviewExists(int id)
        {
            return _context.ItemReviews.Any(e => e.ReviewId == id);
        }
    }
}
