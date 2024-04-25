

export const RegisterUser = async (formValues: any) => {
  return await fetch("/api/register", {
    method: "POST",
    body: JSON.stringify(formValues),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export const getTableData = async (subgraphType: string) => {
  const res = await fetch("/api/getData", {
    method: "POST",
    body: JSON.stringify({ subgraphType }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = res.json();
  console.log(res);
  return (await data).resData;
};

