import { useState } from "react"

import step1 from "../images/step1.PNG"
import step2 from "../images/step2.PNG"
import step3 from "../images/step3.PNG"
import step4 from "../images/step4.PNG"
import step5 from "../images/step5.PNG"
import step6 from "../images/step6.PNG"
import step7 from "../images/step7.PNG"
import step8 from "../images/step8.PNG"
import step9 from "../images/step9.PNG"
import step10 from "../images/step10.PNG"
import step11 from "../images/step11.PNG"
import step12 from "../images/step12.PNG"
import step13 from "../images/step13.PNG"

import Container from "react-bootstrap/Container"
import Card from 'react-bootstrap/Card'
import Carousel from 'react-bootstrap/Carousel';
import ProjectDisplayStyles from "./ProjectDisplayStyles";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


const ProjectDisplay = () => {

  const [index, setIndex] = useState(0)

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex)
  }

  return (
    <ProjectDisplayStyles>
      <Container>

        <Row>
          <Col>
            <h5>Try it out for yourself!</h5>
          </Col>
        </Row>

        <Row className="test_account">
          <Col><h6>Username: test_user</h6></Col>
          <Col><h6>Password: test123!</h6></Col>
        </Row>

        <Card>

          {index === 0 && <Card.Body>
            <Card.Title>Step 1: Home Page </Card.Title>
            <Card.Text>
              The first step to using this application is to create an assay. Let us create another assay in addition to E.coli.
            </Card.Text>
          </Card.Body>}

          {index === 1 && <Card.Body>
            <Card.Title>Step 2: View Clients</Card.Title>
            <Card.Text>
              In this case we are creating an assay for Covid-19. Type of assay, test code, and reagents are also assigned.
            </Card.Text>
          </Card.Body>}

          {index === 2 && <Card.Body>
            <Card.Title>Step 3: View Caregivers</Card.Title>
            <Card.Text>
              An assay for Covid-19 has been made.
            </Card.Text>
          </Card.Body>}

          {index === 3 && <Card.Body>
            <Card.Title>Step 4: Add Timestamp</Card.Title>
            <Card.Text>
              Next, let us bundle E.coli and Covid-19 as a group assay. We give this group assay a name and choose which individual assays are to be bundled together.
            </Card.Text>
          </Card.Body>}

          {index === 4 && <Card.Body>
            <Card.Title>Step 5: Process Timestamps</Card.Title>
            <Card.Text>
              We now have a group assay for E.coli and Covid-19 named as E.coli & Covid-19-Panel
            </Card.Text>
          </Card.Body>}

          {index === 5 && <Card.Body>
            <Card.Title>Step 6: Process Timestamps</Card.Title>
            <Card.Text>
              Now that we have made assays, let us create a batch. First we select an assay for the testing batch.
            </Card.Text>
          </Card.Body>}

          {index === 6 && <Card.Body>
            <Card.Title>Step 7: Preview and Confirm</Card.Title>
            <Card.Text>
              We then give this batch 5 samples to test as well as a unique three-letter testing group.
            </Card.Text>
          </Card.Body>}

          {index === 7 && <Card.Body>
            <Card.Title>Step 8: Additional Information</Card.Title>
            <Card.Text>
              We can than also add another batch with the group assay we made.
            </Card.Text>
          </Card.Body>}

          {index === 8 && <Card.Body>
            <Card.Title>Step 9: View Records</Card.Title>
            <Card.Text>
              Notice how an error comes up if the same testing group is used. The server returns unique validation error and the ui responds accordingly.
            </Card.Text>
          </Card.Body>}

          {index === 9 && <Card.Body>
            <Card.Title>Step 10: View a Record</Card.Title>
            <Card.Text>
              Another feature of this table is the ability to add additional columns. Let us add a column labeled "Client".
            </Card.Text>
          </Card.Body>}

          {index === 10 && <Card.Body>
            <Card.Title>Step 11: Update Record</Card.Title>
            <Card.Text>
              When creating another batch, we are able to include the information for the "Client" column. 
            </Card.Text>
          </Card.Body>}

          {index === 11 && <Card.Body>
            <Card.Title>Step 12: Record Updated</Card.Title>
            <Card.Text>
              We can also updated previous batches by double-clicking a cell. Notice how the first batch on the top as been updated.
            </Card.Text>
          </Card.Body>}

          {index === 12 && <Card.Body>
            <Card.Title>Step 13: View All Timestamps</Card.Title>
            <Card.Text>
              The last feature allows you to order the columns however you wish.
            </Card.Text>
          </Card.Body>}

          <Carousel activeIndex={index} onSelect={handleSelect} variant="dark" interval={null}>

            <Carousel.Item>
              <img
                className="image"
                src={step1}
                alt="First slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="image"
                src={step2}
                alt="Second slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="image"
                src={step3}
                alt="Third slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="image"
                src={step4}
                alt="TFourth slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="image"
                src={step5}
                alt="Fifth slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="image"
                src={step6}
                alt="Sixth slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="image"
                src={step7}
                alt="Seventh slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="image"
                src={step8}
                alt="Eighth slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="image"
                src={step9}
                alt="Ninth slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="image"
                src={step10}
                alt="Tenth slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="image"
                src={step11}
                alt="Eleventh slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="image"
                src={step12}
                alt="Twelvth slide"
              />
            </Carousel.Item>

            <Carousel.Item>
              <img
                className="image"
                src={step13}
                alt="Thirteenth slide"
              />
            </Carousel.Item>

          </Carousel>

        </Card>

      </Container>
    </ProjectDisplayStyles>
  )
}

export default ProjectDisplay