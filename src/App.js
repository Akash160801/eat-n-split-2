import "./styles.css";
import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectFriend, setSelectFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleSplit(friend) {
    setSelectFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  return (
    <div className="app">
      <EatAndSplit
        handleSplit={handleSplit}
        selectFriend={selectFriend}
        setShowAddFriend={setShowAddFriend}
        showAddFriend={showAddFriend}
        handleShowAddFriend={handleShowAddFriend}
        setSelectFriend={setSelectFriend}
      />
    </div>
  );
}

function EatAndSplit({
  handleSplit,
  selectFriend,
  setShowAddFriend,
  showAddFriend,
  handleShowAddFriend,
  setSelectFriend,
}) {
  const [friends, setFriends] = useState(initialFriends);

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend(null);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "2%",
        }}
      >
        <FriendsList
          handleSplit={handleSplit}
          handleShowAddFriend={handleShowAddFriend}
          showAddFriend={showAddFriend}
          friends={friends}
        />
        {selectFriend && (
          <BillSplitter
            onSubmitSplit={handleSplitBill}
            selectFriend={selectFriend}
          />
        )}
      </div>
      {showAddFriend && <AddFriend onAddFriend={handleAddFriend} />}
    </div>
  );
}

function FriendsList({
  handleSplit,
  handleShowAddFriend,
  showAddFriend,
  friends,
}) {
  return (
    <div>
      <div className="bill">
        <ul>
          {friends.map((friend) => (
            <Friend friend={friend} handleSplit={handleSplit} />
          ))}
        </ul>
      </div>
      <div className="btn">
        <button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </button>
      </div>
    </div>
  );
}

function Friend({ friend, handleSplit }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <li
        style={{
          listStyleType: "none",
          backgroundColor: "beige",
          borderRadius: "15px",
          margin: "10px",
        }}
      >
        <div className="user">
          <img src={friend.image} alt={friend.name} height={25} width={25} />
          <span>{friend.name}</span>
        </div>
        {friend.balance < 0 && (
          <p className="comment" style={{ color: "red" }}>
            {" "}
            You owe {friend.name} {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="comment" style={{ color: "green" }}>
            {" "}
            {friend.name} owes me {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance === 0 && (
          <p className="comment"> You and {friend.name} are even.</p>
        )}
      </li>
      <div className="split">
        <button onClick={() => handleSplit(friend)}>Split</button>
      </div>
    </div>
  );
}

function BillSplitter({ selectFriend, onSubmitSplit }) {
  const [bill, setBill] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const paidByFriend = bill ? bill - paidBy : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidBy) return;
    onSubmitSplit(whoIsPaying === "user" ? paidByFriend : -paidBy);
  }

  return (
    <form className="billSplitter " onSubmit={handleSubmit}>
      <h2 style={{ display: "flex", justifyContent: "center" }}>
        Share bill with {selectFriend.name}
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "beige",
          padding: "15px",
          borderRadius: "15px",
          margin: "5px 20px",
        }}
      >
        <span>Total Bill:</span>
        <input
          className="totalBill"
          type="number"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />
        <div
          style={{
            marginTop: "15px",
            display: "grid",
            gridTemplateColumns: "1fr 12rem",
            justifyContent: "space-between",
            alignIitems: "center",
            gap: "1.2rem",
          }}
        >
          <span>Who paid the bill?</span>
          <select
            className="select "
            value={whoIsPaying}
            onChange={(e) => setWhoIsPaying(e.target.value)}
          >
            <option value="you">You</option>
            <option value="friend">{selectFriend.name}</option>
          </select>
          <label>Your share:</label>
          <input
            className="select"
            type="number"
            value={paidBy}
            onChange={(e) =>
              setPaidBy(
                Number(e.target.value) > bill ? paidBy : Number(e.target.value)
              )
            }
          />

          <label>{selectFriend.name} share:</label>
          <input
            className="select"
            type="number"
            disabled
            value={paidByFriend}
          />
        </div>
      </div>
      <div className="btn">
        <button> Split Bill</button>
      </div>
    </form>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = { id, name, image: `${image}?=${id}`, balance: 0 };

    setName("");
    setImage("https://i.pravatar.cc/48");

    onAddFriend(newFriend);
  }
  return (
    <div style={{ marginLeft: "14%" }}>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        className="form btn"
        onSubmit={handleSubmit}
      >
        <div>
          <label> Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label> Image</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <button>Add</button>
        </div>
      </form>
    </div>
  );
}
