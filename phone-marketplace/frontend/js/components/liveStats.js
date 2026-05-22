export default function liveStats(
{
  onlineUsers,
  transactions
}
) {

  return `

    <div class="bg-white p-5 rounded-3xl">

      <div>
        Online Users:
        ${onlineUsers}
      </div>

      <div class="mt-2">
        Transactions:
        ${transactions}
      </div>

    </div>

  `;

}
