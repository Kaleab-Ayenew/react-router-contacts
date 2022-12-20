import { Form , redirect, useLoaderData} from "react-router-dom";
import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export default function Contact() {
  const contact = useLoaderData();

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || null}
        />
    </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !window.confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  // yes, this is a `let` for later
  let favorite = contact.favorite;
  return (
    <Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
}

export async function getContacts(query) {
    await fakeNetwork(`getContacts:${query}`);
    let contacts = await localforage.getItem("contacts");
    if (!contacts) contacts = [];
    if (query) {
      contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }
    return contacts.sort(sortBy("last", "createdAt"));
  }
  
  export async function createContact() {
    console.log("The Create Contact has been called")
    await fakeNetwork();
    let id = Math.random().toString(36).substring(2, 9);
    let contact = { id, createdAt: Date.now() };
    let contacts = await getContacts();
    contacts.unshift(contact);
    await set(contacts);
    return contact;
  }
  
  export async function getContact(id) {
    await fakeNetwork(`contact:${id}`);
    let contacts = await localforage.getItem("contacts");
    let contact = contacts.find(contact => contact.id === id);
    return contact ?? null;
  }
  
  export async function updateContact(id, updates) {
    await fakeNetwork();
    let contacts = await localforage.getItem("contacts");
    let contact = contacts.find(contact => contact.id === id);
    if (!contact) throw new Error("No contact found for", id);
    Object.assign(contact, updates);
    await set(contacts);
    return contact;
  }
  
  export async function deleteContact(id) {
    let contacts = await localforage.getItem("contacts");
    let index = contacts.findIndex(contact => contact.id === id);
    if (index > -1) {
      contacts.splice(index, 1);
      await set(contacts);
      return true;
    }
    return false;
  }
  
  function set(contacts) {
    return localforage.setItem("contacts", contacts);
  }
  
  // fake a cache so we don't slow down stuff we've already seen
  let fakeCache = {};
  
  async function fakeNetwork(key) {
    if (!key) {
      fakeCache = {};
    }
  
    if (fakeCache[key]) {
      return;
    }
  
    fakeCache[key] = true;
    return new Promise(res => {
      setTimeout(res, Math.random() * 800);
    });
  }

  export async function loader({params}){
        let contact = getContact(params.contactId);
        return contact
  }

  export async function deleteAction({params}){
    throw new Error("Oops! That is Nice!")
    let id = params.contactId;
    await deleteContact(id)
    return redirect("/")
  }