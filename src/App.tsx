import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import CreateRequest from "./components/CreateRequest";
import ViewRequest from "./components/ViewRequest";
import PreviewRequest from "./components/PreviewRequest";
import RequestStatus from "./components/RequestStatus";
import RequestWrapper from "./components/RequestWrapper";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center p-4">
                <div className="text-center">
                  <Heart className="h-16 w-16 text-red-500 mx-auto mb-6 animate-pulse" />
                  <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Valentine's Request Creator
                  </h1>
                  <Link
                    to="/create"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Create Your Request
                  </Link>
                </div>
              </div>
            }
          />
          <Route path="/create" element={<CreateRequest />} />
          <Route path="/view/:id" element={<ViewRequest />} />
          <Route
            path="/preview/:id"
            element={
              <RequestWrapper>
                <ViewRequest />
              </RequestWrapper>
            }
          />
          <Route
            path="/share/:id"
            element={
              <RequestWrapper>
                <PreviewRequest />
              </RequestWrapper>
            }
          />
          <Route
            path="/status/:id"
            element={
              <RequestWrapper>
                <RequestStatus />
              </RequestWrapper>
            }
          />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
