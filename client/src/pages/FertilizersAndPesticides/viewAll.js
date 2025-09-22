import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import Logo from '../../images/logo.png'; 
import './viewAll.css';

pdfMake.vfs = pdfFonts.vfs;

function ViewAll() {
    const navigate = useNavigate();
    const [details, setDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('token');

    // Redirect if not logged in
    useEffect(() => {
        if (!token) navigate('/login');
    }, [navigate, token]);

    // Fetch user-specific details from backend
    const fetchDetails = async () => {
        if (!token) return;
        try {
            const response = await axios.get(`http://localhost:5001/details/getdetails?page=1&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDetails(response.data.data); // backend already filters by user
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching details:", error);
            setIsLoading(false);
            if (error.response?.status === 401) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [token]);

    // Filter details based on search term
    const filteredDetails = details.filter(detail =>
        Object.values(detail).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Delete a detail
    const handleDelete = async (id) => {
        if (!token) return;
        if (!window.confirm("Are you sure you want to delete this detail?")) return;

        try {
            await axios.delete(`http://localhost:5001/details/details/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Detail deleted successfully!");
            fetchDetails();
        } catch (error) {
            console.error("Error deleting detail:", error);
            alert(error.response?.data?.message || "An error occurred while deleting the detail.");
        }
    };

    // Edit a detail
    const handleEdit = (id) => navigate(`/editDetails/${id}`);

    // PDF download
    const handleDownloadReport = async () => {
        const logoDataUrl = await loadImage(Logo);
        const docDefinition = {
            content: [
                { image: logoDataUrl, width: 100, margin: [0, 10, 0, 0] },
                { text: 'Refill Request Details Report', style: 'header' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*','*','*','*','*','*','*','*','*'],
                        body: [
                            [
                                { text: "Receiver's Name", fillColor: '#A5D6A7', bold: true },
                                { text: 'Phone Number', fillColor: '#A5D6A7', bold: true },
                                { text: 'Address', fillColor: '#A5D6A7', bold: true },
                                { text: 'Product Type', fillColor: '#A5D6A7', bold: true },
                                { text: 'Product Name', fillColor: '#A5D6A7', bold: true },
                                { text: 'Brand', fillColor: '#A5D6A7', bold: true },
                                { text: 'Amount', fillColor: '#A5D6A7', bold: true },
                                { text: 'Total Price', fillColor: '#A5D6A7', bold: true },
                                { text: 'Status', fillColor: '#A5D6A7', bold: true }
                            ],
                            ...filteredDetails.map(d => [
                                { text: d.receiverName, fillColor: '#E5EFE5' },
                                { text: d.phoneNumber, fillColor: '#E5EFE5' },
                                { text: d.address, fillColor: '#E5EFE5' },
                                { text: d.productType, fillColor: '#E5EFE5' },
                                { text: d.productName, fillColor: '#E5EFE5' },
                                { text: d.brand, fillColor: '#E5EFE5' },
                                { text: formatAmount(d.amount, d.unit), fillColor: '#E5EFE5' },
                                { text: formatPrice(d.price), fillColor: '#E5EFE5' },
                                { text: d.status, fillColor: '#E5EFE5' }
                            ])
                        ]
                    },
                    layout: 'lightHorizontalLines'
                }
            ],
            styles: { header: { fontSize: 18, bold: true, margin: [0,0,0,20], alignment: 'center' } },
            pageSize: 'A2',
            pageMargins: [80,60,40,80]
        };
        pdfMake.createPdf(docDefinition).download('refill_details_report.pdf');
    };

    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext('2d').drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = reject;
        });
    };

    if (isLoading) return <div>Loading details...</div>;

    const formatPrice = (amount) => {
    if (amount == null) return '';
    return `Rs. ${Number(amount).toLocaleString()}/=`;
};

const formatAmount = (amount, unit) => {
    if (!amount || !unit) return '';
    // Capitalize unit for display
    const formattedUnit = unit.charAt(0).toUpperCase() + unit.slice(1);
    return `${amount} ${formattedUnit}`;
};


    return (
        <div className="view-all">
            <button className="add-button" onClick={() => navigate('/addDetails')}>Add Details</button>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <button className="search-button" onClick={() => setSearchTerm(searchTerm)}>Search</button>
            <button className="download-button" onClick={handleDownloadReport}>Download PDF</button>

            <h1 className="topic">All Details</h1>

            {filteredDetails.length === 0 ? (
                <p>No details found.</p>
            ) : (
                <table className="detail-table">
                    <thead>
                        <tr>
                            <th>Receiver's Name</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                            <th>Product Type</th>
                            <th>Product Name</th>
                            <th>Brand</th>
                            <th>Amount</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDetails.map(d => (
                            <tr key={d._id}>
                                <td>{d.receiverName}</td>
                                <td>{d.phoneNumber}</td>
                                <td>{d.address}</td>
                                <td>{d.productType}</td>
                                <td>{d.productName}</td>
                                <td>{d.brand}</td>
                                <td>{formatAmount(d.amount, d.unit)}</td>
                                <td>{formatPrice(d.price)}</td>
                                <td>{d.status}</td>
                                <td>
                                    <button className="action-button delete" onClick={() => handleDelete(d._id)}>Delete</button>
                                    <button className="action-button edit" onClick={() => handleEdit(d._id)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ViewAll;
