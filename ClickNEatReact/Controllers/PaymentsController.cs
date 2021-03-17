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
using System.Diagnostics;

namespace ClickNEatReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly ClickEatContext _context;

        public PaymentsController(ClickEatContext context)
        {
            _context = context;
        }


        [Authorize(Roles = UserRole.Admin + ","+UserRole.Waiter)]
        // GET: api/Payments
        [HttpGet("period/{period}")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPaymentByPeriod(string period)
        {
            if(period.Equals("1"))
                return await _context.Payment.Include(p => p.order).ThenInclude(o => o.OrderItems).ThenInclude(o => o.MenuItem).ThenInclude(m => m.MenuCategory).Where(p => p.CreatedAt.Date == DateTime.Now.Date).ToListAsync();
            else if (period.Equals("7"))
                return await _context.Payment.Include(p => p.order).ThenInclude(o => o.OrderItems).ThenInclude(o => o.MenuItem).ThenInclude(m => m.MenuCategory).Where(p => (p.CreatedAt.Date <= DateTime.Now.Date) && (p.CreatedAt.Date > DateTime.Now.AddDays(-7))).ToListAsync();
            else if (period.Equals("30"))
                return await _context.Payment.Include(p => p.order).ThenInclude(o => o.OrderItems).ThenInclude(o => o.MenuItem).ThenInclude(m => m.MenuCategory).Where(p => (p.CreatedAt.Date <= DateTime.Now.Date) && (p.CreatedAt.Date > DateTime.Now.AddDays(-30))).ToListAsync();
            else
                return await _context.Payment.Include(p => p.order).ThenInclude(o => o.OrderItems).ThenInclude(o => o.MenuItem).ThenInclude(m => m.MenuCategory).Where(p => (p.CreatedAt.Year == DateTime.Now.Year)).ToListAsync();

        }

        [Authorize(Roles =UserRole.Admin)]
        // GET: api/Payments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPayment()
        {
            return await _context.Payment.Include(p=>p.order).ThenInclude(o => o.OrderItems).ThenInclude(o => o.MenuItem).ThenInclude(m => m.MenuCategory).ToListAsync();
        }

        // GET: api/Payments/5
        [Authorize(Roles = UserRole.Admin)]
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPayment(int id)
        {
            var payment = await _context.Payment.Include(p => p.order).ThenInclude(o => o.OrderItems).ThenInclude(o => o.MenuItem).ThenInclude(m => m.MenuCategory).Where(p=>p.PaymentId==id).FirstOrDefaultAsync();

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }

        // PUT: api/Payments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = UserRole.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPayment(int id, Payment payment)
        {
            if (id != payment.PaymentId)
            {
                return BadRequest();
            }

            _context.Entry(payment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaymentExists(id))
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

        // POST: api/Payments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Payment>> PostPayment(Payment payment)
        {
            var amount = 0.0;

            foreach(var item in payment.order.OrderItems)
            {
                MenuItem menuItem = await _context.menuItems.FindAsync(item.MenuItemId);
                amount += menuItem.Price * item.ItemAmmount;
            }

            payment.Amount = amount;

            _context.Payment.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPayment", new { id = payment.PaymentId }, payment);
        }

        [HttpPost("DuePayment")]
        public async Task<ActionResult<Payment>> PostDuePayment(Payment payment)
        {
            var amount = 0.0;

            foreach (var item in payment.order.OrderItems)
            {
                MenuItem menuItem = await _context.menuItems.FindAsync(item.MenuItemId);
                amount += menuItem.Price * item.ItemAmmount;
            }

            payment.Amount = amount;
            var order = payment.order;
            payment.order = null;

            _context.Payment.Add(payment);
            await _context.SaveChangesAsync();

            order.Status = "Paid";
            _context.Entry(order).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                Console.WriteLine(ex.Message);
            }

            return CreatedAtAction("GetPayment", new { id = payment.PaymentId }, payment);
        }

        // DELETE: api/Payments/5
        [Authorize(Roles = UserRole.Admin)]
        [HttpDelete("{id}")]

        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payment.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.Payment.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PaymentExists(int id)
        {
            return _context.Payment.Any(e => e.PaymentId == id);
        }
    }
}
