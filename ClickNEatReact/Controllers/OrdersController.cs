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
using Newtonsoft.Json;

namespace ClickNEatReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ClickEatContext _context;

        public OrdersController(ClickEatContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> Getorders()
        {
            return await _context.orders.Where(o=>o.Status!="Served").Include(o => o.OrderItems).ThenInclude(o=>o.MenuItem).ThenInclude(m => m.MenuCategory).OrderByDescending(o=>o.OrderId).ToListAsync();
        }

        
        [HttpPost("userOrders/ids")]
        public async Task<ActionResult<IEnumerable<Order>>> GetordersByIds([FromBody] string orderIds)
        {
            
            //orderIds = JsonConvert.DeserializeObject<string>(orderIds);
            orderIds = orderIds.Trim().Replace(' ',',');
            
            var orders= await _context.orders.FromSqlRaw("select * from orders where orderId in ("+ orderIds + ")").Include(o => o.OrderItems).ThenInclude(o => o.MenuItem).ThenInclude(m => m.MenuCategory).OrderByDescending(o => o.OrderId).ToListAsync();

            return orders;
        }

        // GET: api/Orders/5
       
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.orders.Include(o => o.OrderItems).ThenInclude(o=>o.MenuItem).ThenInclude(m=>m.MenuCategory).Where(o => o.OrderId == id).FirstOrDefaultAsync();
            

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, Order order)
        {
            if (id != order.OrderId)
            {
                return BadRequest();
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
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
        [HttpPut("{id}/addItems")]
        public async Task<IActionResult> PutOrderToAddItem(int id, Order order)
        {
            var prevOrder = await _context.orders.Include(o => o.OrderItems).ThenInclude(o => o.MenuItem).ThenInclude(m => m.MenuCategory).Where(o => o.OrderId == id).FirstOrDefaultAsync();
            foreach(OrderItem item in order.OrderItems)
            {
                prevOrder.OrderItems.Add(item);
            }
            if (id != prevOrder.OrderId)
            {
                return BadRequest();
            }
            prevOrder.TableIdentity = order.TableIdentity;
            prevOrder.Total += order.Total;

            _context.Entry(prevOrder).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { prevOrder });
        }

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(Order order)
        {
            _context.orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrder", new { id = order.OrderId }, order);
        }

        // DELETE: api/Orders/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.orders.Any(e => e.OrderId == id);
        }
    }
}
