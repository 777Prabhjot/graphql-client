"use client";
import { ChangeEvent, useState } from "react";
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [values, setValues] = useState<{
    name: string;
    age: number | string;
    country: string;
  }>({
    name: "",
    age: "",
    country: "",
  });
  const [editUser, setEditUser] = useState(false);
  const [userId, setUserId] = useState<number>(0);

  type User = {
    id: number;
    name: string;
    age: number;
    country: string;
  };

  const GET_ALL_USERS = gql`
    query getAllUser {
      users {
        id
        name
        age
        country
      }
    }
  `;

  const GET_USER_INFO = gql`
    query getSingleUser($name: String!) {
      user(name: $name) {
        id
        name
        age
        country
      }
    }
  `;

  const CREATE_USER = gql`
    mutation createNewUser($inputs: UserInputs!) {
      createUser(inputs: $inputs) {
        id
        name
      }
    }
  `;

  const EDIT_USER = gql`
    mutation EditUser($updateInputs: UpdateUserInputs!) {
      updateUser(inputs: $updateInputs) {
        id
        name
      }
    }
  `;

  const DELETE_USER = gql`
    mutation UserDelete($deleteUserId: ID!) {
      deleteUser(id: $deleteUserId) {
        id
      }
    }
  `;

  const { data, loading: usersLoading, refetch } = useQuery(GET_ALL_USERS);
  const [getUserInfo, { data: userInfo, loading }] =
    useLazyQuery(GET_USER_INFO);
  const user = userInfo?.user;

  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(EDIT_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <main>
      <h1 className="text-6xl">Users</h1>
      {usersLoading ? (
        <div className="mt-8 ms-4 text-3xl">Loading...</div>
      ) : (
        <div className="flex items-center">
          {data &&
            data.users?.map((user: User) => {
              return (
                <div
                  className="p-7 ms-3 mt-3 border-2 relative border-blue-300"
                  key={user.id}
                >
                  <div
                    className="text-green-500 cursor-pointer absolute top-1 left-2"
                    onClick={() => {
                      setEditUser(true);
                      setValues({
                        name: user.name,
                        age: user.age,
                        country: user.country,
                      });
                      setUserId(user.id);
                    }}
                  >
                    edit
                  </div>
                  <div
                    className="text-red-500 cursor-pointer font-bold absolute top-1 right-2"
                    onClick={() => {
                      deleteUser({ variables: { deleteUserId: user.id } });
                      refetch();
                    }}
                  >
                    X
                  </div>
                  <h2>Name: {user.name}</h2>
                  <h3>Age: {user.age}</h3>
                  <h4>Country: {user.country}</h4>
                </div>
              );
            })}
        </div>
      )}
      <div className="mt-10 flex flex-col items-center">
        <input
          className="w-[20%] mb-3 border-[1px] p-3"
          type="text"
          placeholder="get single user info..."
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="bg-blue-400 p-3 text-white"
          onClick={() => getUserInfo({ variables: { name: name } })}
        >
          Get User Info
        </button>
        {loading && <div className="mt-8 text-3xl">Loading...</div>}
        {user && (
          <div className="p-5 ms-3 mt-8 border-2 border-orange-300">
            <h2>Name: {user.name}</h2>
            <h3>Age: {user.age}</h3>
            <h4>Country: {user.country}</h4>
          </div>
        )}
      </div>
      <div className="mt-10 border-t-2 border-blue-500 flex flex-col items-center">
        <h1 className="text-3xl mt-3">Create New User</h1>
        <div className="mt-6 flex flex-col">
          <input
            className="mb-3 border-[1px] p-3"
            type="text"
            name="name"
            value={values.name}
            placeholder="Name..."
            onChange={handleChange}
          />
          <input
            className="mb-3 border-[1px] p-3"
            type="number"
            name="age"
            value={values.age}
            placeholder="Age..."
            onChange={handleChange}
          />
          <input
            className="mb-3 border-[1px] p-3"
            type="text"
            name="country"
            value={values.country}
            placeholder="Country..."
            onChange={handleChange}
          />
          {!editUser ? (
            <button
              className="bg-blue-400 p-3 text-white"
              onClick={() => {
                createUser({
                  variables: {
                    inputs: {
                      name: values.name,
                      age: Number(values.age),
                      country: values.country,
                    },
                  },
                });

                setValues({
                  name: "",
                  age: "",
                  country: "",
                });
                refetch();
              }}
            >
              Create User
            </button>
          ) : (
            <button
              className="bg-green-400 p-3 text-white"
              onClick={() => {
                updateUser({
                  variables: {
                    updateInputs: {
                      id: userId,
                      name: values.name,
                      age: Number(values.age),
                      country: values.country,
                    },
                  },
                });

                setValues({
                  name: "",
                  age: "",
                  country: "",
                });
                refetch();
              }}
            >
              Edit User
            </button>
          )}
          {editUser && (
            <button
              className="bg-red-400 p-3 mt-2 text-white"
              onClick={() => {
                setEditUser(false);
                setValues({
                  name: "",
                  age: "",
                  country: "",
                });
              }}
            >{`Don't Edit`}</button>
          )}
        </div>
      </div>
    </main>
  );
}
