export const fetchExample = async () => {
    const response = await fetch("https://api.example.com/data");
    return response.json();
};
